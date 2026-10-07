# CyberAkshak Admin Web Panel Integration Contract

This document defines the API contract, database queries, and role verification methods required to build a separate **Admin Web Panel** (React / Next.js) using the existing Supabase infrastructure without requiring database schema modifications.

---

## 🔐 1. Authentication & Role Verification

The Admin Web Panel uses `@supabase/supabase-js` connected to the same Supabase project URL and Anon Key.

### Login & Admin Role Check Workflow:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function adminLogin(email, password) {
  // 1. Authenticate with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw authError;

  // 2. Query user profile to verify admin role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('id', authData.user.id)
    .single();

  if (profileError) throw profileError;

  if (profile.role !== 'admin') {
    await supabase.auth.signOut();
    throw new Error('Access denied: Administrator privileges required.');
  }

  return { user: authData.user, profile };
}
```

---

## 📅 2. Events Management CRUD Queries

### List All Events (including Drafts & Archived):
```javascript
export async function getAdminEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*, created_by_profile:profiles(full_name, email)')
    .order('starts_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

### Upload Event Image and Create Event:

Upload the image to the public `Events` Storage bucket first, then save the
returned object path (not a temporary signed URL) in `events.image_url`. The
mobile app turns that path into a public URL when it displays the event. Keep
the `Events` bucket public so published event images can load without an expiring
URL. In the Supabase Dashboard, open Storage → Events → Edit bucket and enable
public access. Public buckets allow URL-based downloads without a public
`storage.objects` SELECT policy; configure policies only for listing and writes.

In Storage → Policies, add policies on `storage.objects` for the `Events` bucket
with the `authenticated` role and these expressions:

- SELECT (so the future admin panel can list its images): `bucket_id = 'Events' AND public.is_admin(auth.uid())`
- INSERT (upload): use the same expression as `WITH CHECK`.
- UPDATE (replace): use the expression as both `USING` and `WITH CHECK`.
- DELETE: use the expression as `USING`.

The SQL Editor role in this project does not own Supabase's managed
`storage.objects` table, so create these policies in the Dashboard instead of
running `CREATE POLICY` statements there.

For the image already uploaded at the bucket root, put the exact object name
`Screenshot 2026-10-08 010806.png` in that event row's `image_url` field.

```javascript
const imagePath = `events/${crypto.randomUUID()}-${file.name}`;
const { error: uploadError } = await supabase.storage
  .from('Events')
  .upload(imagePath, file, { contentType: file.type, upsert: false });

if (uploadError) throw uploadError;

// Pass imagePath as eventData.image_url to createAdminEvent below.
```

### Create New Event:
```javascript
export async function createAdminEvent(eventData) {
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        title: eventData.title,
        description: eventData.description,
        starts_at: eventData.starts_at,
        ends_at: eventData.ends_at,
        location: eventData.location,
        image_url: eventData.image_url,
        category: eventData.category || 'Webinar',
        registration_url: eventData.registration_url,
        status: eventData.status || 'published',
        created_by: user.id,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Log admin action
  await logAdminAction('CREATE_EVENT', `Event ID ${data.id}`, { title: data.title });

  return data;
}
```

### Update Event / Change Status:
```javascript
export async function updateAdminEvent(eventId, updates) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw error;

  await logAdminAction('UPDATE_EVENT', `Event ID ${eventId}`, updates);

  return data;
}
```

---

## 👥 3. User Management Queries

### Search & Paginate Registered Users:
```javascript
export async function getAdminUsers({ page = 1, limit = 20, searchQuery = '' }) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (searchQuery) {
    query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return { users: data, total: count };
}
```

### Update User Role (Admin Only):
```javascript
export async function updateUserRole(userId, newRole) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  await logAdminAction('UPDATE_USER_ROLE', `User ID ${userId}`, { newRole });

  return data;
}
```

---

## 🔔 4. Push Notification Dispatching

### Create & Trigger Broadcast Push Notification:
```javascript
export async function dispatchNotification({ title, body, audience = 'all', targeting = {} }) {
  const user = (await supabase.auth.getUser()).data.user;

  // 1. Insert notification entry in database
  const { data: notif, error } = await supabase
    .from('notifications')
    .insert([
      {
        title,
        body,
        audience,
        targeting,
        created_by: user.id,
        sent_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // 2. Invoke Supabase Edge Function to dispatch via FCM HTTP v1
  const { data: edgeResult, error: edgeError } = await supabase.functions.invoke(
    'send-push-notification',
    {
      body: { notification_id: notif.id, title, body, audience, targeting },
    }
  );

  if (edgeError) console.warn('Edge function warning:', edgeError);

  await logAdminAction('DISPATCH_NOTIFICATION', `Notification ID ${notif.id}`, { title, audience });

  return notif;
}
```

---

## 📜 5. Audit Logging Helper

```javascript
export async function logAdminAction(action, targetResource, details = {}) {
  const user = (await supabase.auth.getUser()).data.user;

  await supabase.from('admin_audit_log').insert([
    {
      admin_id: user.id,
      action,
      target_resource: targetResource,
      details,
    },
  ]);
}
```
