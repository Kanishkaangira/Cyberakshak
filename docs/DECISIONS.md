# Architectural Decision Record (ADR): Backend & Auth Architecture

**Status**: Proposed / Pending Phase 0 Approval  
**Target Version**: CyberAkshak v1.1.0 (Phase 2 & Phase 3)

---

## 1. Context & Business Requirements

CyberAkshak requires a unified, scalable, secure, and free-tier friendly backend stack that serves both:
1. The **CyberAkshak React Native Mobile App** (Android / iOS).
2. A future **Admin Web Dashboard** (React / Next.js) for content moderation, event management, user management, audit logging, and push notification dispatch.

Key System Capabilities Needed:
- **Authentication**: Email + password with email OTP verification, in-app password reset via OTP, persistent session handling with token auto-refresh.
- **Relational Data Storage**: User profiles, events calendar, targetable push notifications, user device tokens, and admin audit logs.
- **Role-Based Security**: Strict server-enforced role access (`user`, `admin`, `moderator`) with zero trust in client-side claims.
- **Push Notifications**: FCM (Firebase Cloud Messaging) for broadcast and segment-targeted mobile push notifications.

---

## 2. Recommended Stack: Unified Supabase Backend + FCM for Push

### Primary Choice: Supabase (PostgreSQL + Supabase Auth + RLS + Edge Functions)

We recommend **Supabase** as the single primary backend database and authentication provider for CyberAkshak.

#### Key Architectural Reasons:

1. **PostgreSQL Relational Data Integrity**:
   - Structured schemas for `profiles`, `events`, `notifications`, `device_tokens`, and `admin_audit_log`.
   - Foreign key constraints, automated database triggers (e.g., auto-creating a `profiles` record upon auth signup), and SQL indexes for efficient querying.

2. **Database-Enforced Row Level Security (RLS)**:
   - Every single table enforces strict RLS policies.
   - Admin access is validated via a database helper function `is_admin()`, which checks `profiles.role` directly inside Postgres.
   - Client-side code cannot forge admin rights or mutate non-permitted fields (such as promoting oneself to `admin`).

3. **Native Email OTP**:
   - Supabase Auth natively supports 6-digit email OTP signup and verification out-of-the-box.

4. **Zero-API-Layer Admin Web Panel Integration**:
   - Supabase automatically exposes auto-generated, type-safe REST APIs (PostgREST) over HTTP.
   - The future Admin Web Panel can directly consume `@supabase/supabase-js` with admin RLS permissions, eliminating the need to write and host a separate custom backend server for admin CRUD operations.

---

## 3. Evaluation of Existing Firebase Setup vs. Supabase

### Current Firebase Usage in Repository:
- **Code Audit**:
  - `firebase.js`: Root file initializing Firebase Web SDK (v12) with hardcoded web config.
  - `src/services/eventsService.js`: Uses Firestore `collection(db, 'events')` and `onSnapshot` / `getDocs`.
  - Dependencies: `@react-native-firebase/app`, `@react-native-firebase/firestore`, and `firebase`.

### Why Migrate DB/Auth to Supabase instead of expanding Firebase?

| Architectural Dimension | Supabase (Recommended) | Firebase (Firestore + Firebase Auth) |
| :--- | :--- | :--- |
| **Data Model** | Relational SQL (Postgres). Ideal for user profiles, foreign keys, audit logs, and complex admin filtering. | Document NoSQL (Firestore). Unstructured, difficult to join across collections without redundant data duplication. |
| **Security & Roles** | Row Level Security (RLS) via SQL functions (`is_admin()`). Clean, auditable, server-side enforced. | Security Rules written in domain-specific rule language. Easy to make critical misconfigurations on multi-role apps. |
| **Email OTP Auth** | Native 6-digit email OTP generation and verification in core auth. | Requires paid Identity Platform upgrade or custom Cloud Functions + 3rd party email service. |
| **Admin Panel Readiness** | Instant REST/GraphQL endpoints with RLS enforcement. Admin web panel can be built in days. | Requires building separate Firebase Admin SDK Node.js server or writing complex client Firestore rules. |
| **Push Notifications** | Integrated via Supabase Edge Functions calling FCM HTTP v1. | Native FCM support (Industry standard). |

### Conclusion on Firebase:
- **Decision**: Replace Firebase Firestore in `src/services/eventsService.js` with Supabase.
- **Retain**: Keep Firebase Android setup (`google-services.json` and `@react-native-firebase/app`) **exclusively** for Firebase Cloud Messaging (FCM) device token registration and push notification dispatching in Phase 3.

---

## 4. Free-Tier Limits & Production Operational Requirements

### ⚠️ Critical Free-Tier Caveats & Solutions:

1. **Supabase Built-in Email Sender Limits**:
   - *Constraint*: Supabase's default email service has a strict rate limit of **3 emails per hour** per project (intended strictly for development/testing).
   - *Requirement*: Prior to staging/production launch, a free custom SMTP service must be configured in the Supabase Dashboard (`Authentication -> Email Settings`).
   - *Recommended SMTP Providers*: **Resend** (3,000 free emails/month), **Brevo** (formerly Sendinblue, 300 free emails/day), or **SendGrid** (100 free emails/day).

2. **OTP Cooldown & Security Policies**:
   - **Resend Cooldown**: 60 seconds (enforced in mobile app UI & Supabase rate limit settings).
   - **OTP Code Expiry**: 10 minutes (configured in Supabase Auth settings).
   - **Password Policy**: Minimum 8 characters, requiring at least one letter and one number.

3. **Database Free-Tier Allowances**:
   - Supabase Free Tier includes 500 MB database storage, 50,000 monthly active users (MAU), 5 GB file storage, and 500,000 Edge Function invocations per month, which easily covers CyberAkshak's initial scale.

---

## 5. Dependency Additions Justification

To execute Phase 2 (Auth + Database), the following packages are proposed:

1. `@supabase/supabase-js`: Official JavaScript client for Supabase (DB + Auth).
2. `@react-native-async-storage/async-storage`: Standard React Native persistent key-value storage for session persistence across app restarts.
3. `@react-native-firebase/messaging`: Native FCM token registration and incoming push message handling on Android.
4. `@notifee/react-native`: Android notification permission requests, channels, and foreground notification display.

The mobile app stores each signed-in user's FCM token in the existing
`public.device_tokens` table. Push messages shown while the app is open use
Notifee; background messages are displayed by Android from the FCM notification
payload. Event notifications should include a string `type: "event"` and
`event_id` in their FCM data payload so tapping the notification opens Events.
Successful event broadcasts are also stored in `public.notifications` for the
in-app notification inbox. Android pushes use a dedicated branded high-
visibility channel and display the event banner image when one is available.

## 6. Internationalization

The mobile app uses `i18next` with `react-i18next` for translation. English
(`en`) is the fallback. Locale JSON resources in `src/locales/` are enabled
when complete translations are available. Supported language codes and display
names are maintained in `src/constants/languages.js`; the profile language
preference stores the selected locale code.
