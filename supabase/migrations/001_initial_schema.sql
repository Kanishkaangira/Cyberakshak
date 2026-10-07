-- ==========================================
-- CyberAkshak Supabase Initial Database Schema
-- Migration 001: Tables, Triggers, Functions, & RLS Policies
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  city TEXT,
  state TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'English',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for profiles email & role lookup
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ------------------------------------------
-- 2. HELPER FUNCTION: is_admin()
-- ------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ------------------------------------------
-- 3. TRIGGER: AUTOMATIC PROFILE CREATION ON SIGNUP
-- ------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    avatar_url,
    city,
    state,
    preferred_language,
    role
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'CyberAkshak User'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'state',
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'English'),
    'user' -- Always default to regular user
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------
-- 4. PREVENT USERS FROM CHANGING THEIR OWN ROLE
-- ------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_role_self_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role AND NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only administrators can change user roles.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_prevent_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_self_update();

-- ------------------------------------------
-- 5. EVENTS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  location TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Webinar',
  registration_url TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_starts_at ON public.events(starts_at);

CREATE TRIGGER trigger_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------
-- 6. NOTIFICATIONS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'all' CHECK (audience IN ('all', 'segment', 'user')),
  targeting JSONB DEFAULT '{}'::jsonb,
  data JSONB DEFAULT '{}'::jsonb,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- 7. DEVICE TOKENS TABLE (FCM)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fcm_token TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'android',
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, fcm_token)
);

CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id ON public.device_tokens(user_id);

-- ------------------------------------------
-- 8. ADMIN AUDIT LOG TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_resource TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.admin_audit_log(created_at DESC);

-- ------------------------------------------
-- 9. FUTURE TABLES EXTENSIBILITY STUBS
-- ------------------------------------------

-- Announcements table (Future feature)
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scam Reports table (Future feature)
CREATE TABLE IF NOT EXISTS public.scam_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  scam_type TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'verified', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scam_reports ENABLE ROW LEVEL SECURITY;

-- --- PROFILES POLICIES ---
-- Users can read their own profile OR admins can read any profile
CREATE POLICY "Profiles read policy" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR public.is_admin(auth.uid())
  );

-- Users can update their own profile OR admins can update any profile
CREATE POLICY "Profiles update policy" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR public.is_admin(auth.uid())
  );

-- --- EVENTS POLICIES ---
-- Anyone (authenticated or guest) can read published events
CREATE POLICY "Events public read published" ON public.events
  FOR SELECT USING (
    status = 'published' OR public.is_admin(auth.uid())
  );

-- Admins only can insert events
CREATE POLICY "Events admin insert" ON public.events
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- Admins only can update events
CREATE POLICY "Events admin update" ON public.events
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Admins only can delete events
CREATE POLICY "Events admin delete" ON public.events
  FOR DELETE USING (public.is_admin(auth.uid()));

-- --- NOTIFICATIONS POLICIES ---
-- Users can read notifications targeted to all or to their specific user ID
CREATE POLICY "Notifications read policy" ON public.notifications
  FOR SELECT USING (
    audience = 'all' 
    OR (audience = 'user' AND (targeting->>'user_id')::uuid = auth.uid())
    OR public.is_admin(auth.uid())
  );

-- Admins only can insert/update notifications
CREATE POLICY "Notifications admin insert" ON public.notifications
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Notifications admin update" ON public.notifications
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- --- DEVICE TOKENS POLICIES ---
-- Users can manage their own device tokens
CREATE POLICY "Device tokens user select" ON public.device_tokens
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Device tokens user insert" ON public.device_tokens
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Device tokens user update" ON public.device_tokens
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Device tokens user delete" ON public.device_tokens
  FOR DELETE USING (user_id = auth.uid());

-- --- ADMIN AUDIT LOG POLICIES ---
-- Admins only can read audit logs
CREATE POLICY "Audit log admin select" ON public.admin_audit_log
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Admins only can insert audit log entries
CREATE POLICY "Audit log admin insert" ON public.admin_audit_log
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- --- SCAM REPORTS POLICIES ---
CREATE POLICY "Scam reports insert" ON public.scam_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Scam reports select" ON public.scam_reports
  FOR SELECT USING (reporter_id = auth.uid() OR public.is_admin(auth.uid()));

-- ------------------------------------------
-- 11. RPC FUNCTION FOR SECURE ACCOUNT DELETION
-- ------------------------------------------
-- Callable in-app to satisfy Google Play requirement for account deletion.
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS VOID AS $$
DECLARE
  target_id UUID := auth.uid();
BEGIN
  IF target_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete device tokens
  DELETE FROM public.device_tokens WHERE user_id = target_id;
  
  -- Delete profile row (cascades to auth.users if trigger configured or service role used)
  DELETE FROM public.profiles WHERE id = target_id;
  
  -- Delete from auth.users (requires security definer)
  DELETE FROM auth.users WHERE id = target_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;
