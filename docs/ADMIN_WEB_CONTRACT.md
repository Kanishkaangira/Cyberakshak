# CyberAkshak Admin Web Panel Integration Contract

This document defines the API contract and database queries for a separate **Admin Web Panel** (React / Next.js) using the existing Supabase infrastructure.

---

## 🔐 1. Authentication & Role Verification

The Admin Web Panel uses `@supabase/supabase-js` connected to the same Supabase project URL and publishable key. Admin eligibility is stored in `public.admins`; `profiles.role` and `admin_audit_log` are not used.

### Login & Admin Access Check Workflow:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function adminLogin(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  // Check the allowlist before attempting password authentication.
  const { data: allowed, error: allowlistError } = await supabase.rpc(
    'can_login_admin',
    { email: normalizedEmail },
  );

  if (allowlistError) throw allowlistError;
  if (allowed !== true) throw new Error('Access denied');

  // Authenticate the admin's existing Supabase Auth account.
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (authError) throw authError;

  // Verify the authenticated UID against the admins allowlist as well.
  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('id, email')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (adminError || !admin) {
    await supabase.auth.signOut();
    if (adminError) throw adminError;
    throw new Error('Access denied');
  }

  return { user: authData.user, admin };
}
```

Create the admin using Supabase Authentication (Dashboard or the Auth API),
then copy that Auth user's UID and email into `public.admins`. Do not insert
directly into the managed `auth.users` table. The `can_login_admin` RPC should
return a boolean and accept the `email` argument shown above. The post-login
`admins.id` lookup is a second check; allow authenticated admins to read only
their own row through RLS.

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

  return notif;
}
```

For an event broadcast, send an FCM notification payload with the event title
and body, and include `type: "event"` and `event_id: "<event UUID>"` as string
values in the FCM data payload. The Android app registers signed-in users'
tokens in `public.device_tokens`, displays foreground pushes in the system
notification tray, and opens the Events tab when the user taps an event push.
The event create/update workflow should invoke the server-side push dispatcher
only when `notify_app_users` is true; never send FCM credentials from the app.
