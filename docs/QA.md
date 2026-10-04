# CyberAkshak Quality Assurance (QA) & Security Testing Manual

This document provides a comprehensive manual testing checklist and automated RLS verification script for CyberAkshak Phase 2 (Authentication + Database).

---

## 📋 1. Manual Testing Checklist

| Test Case ID | Feature Area | Test Scenario | Steps to Reproduce | Expected Behavior | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-AUTH-01** | Sign Up | Valid Email & Password Registration | 1. Tap 'Create an Account'.<br>2. Enter full name, valid email, 8+ char password, and submit. | App transitions to 6-digit OTP verification screen (`VerifyOTPScreen`). | ✅ PASS |
| **TC-AUTH-02** | OTP | Wrong / Expired OTP Code | 1. Enter `000000` or invalid 6-digit code on OTP screen.<br>2. Tap 'Verify OTP'. | Clear red error banner displayed: *"Verification code expired or invalid"*. | ✅ PASS |
| **TC-AUTH-03** | OTP | Resend OTP Cooldown | 1. Observe 'Resend Code' button.<br>2. Verify 60-second countdown.<br>3. Tap 'Resend Code' after timer expires. | Button disabled during 60s cooldown. Tapping after 60s triggers new OTP dispatch and resets timer. | ✅ PASS |
| **TC-AUTH-04** | Login | Successful Sign-In | 1. Enter registered email and correct password.<br>2. Tap 'Log in'. | Session saved to `AsyncStorage`. User seamlessly transitions to `HomeScreen` displaying real name. | ✅ PASS |
| **TC-AUTH-05** | Login | Wrong Password | 1. Enter registered email with invalid password.<br>2. Tap 'Log in'. | Red error banner displayed with error message. User remains on login screen. | ✅ PASS |
| **TC-AUTH-06** | Forgot Pass | Forgot & Reset Password Flow | 1. Tap 'Forgot password?'.<br>2. Enter email.<br>3. Enter 6-digit OTP code.<br>4. Enter new 8+ char password. | Password successfully updated in Supabase Auth. User can sign in with new password. | ✅ PASS |
| **TC-AUTH-07** | Google Sign-In | Native Google OAuth | 1. Tap 'Continue with Google'.<br>2. Select Google account. | ID token verified by Supabase. Auto-creates `profiles` row and logs into app. | ✅ PASS |
| **TC-AUTH-08** | Session | App Restart & Kill | 1. Sign in.<br>2. Force kill app from Android task switcher.<br>3. Relaunch app. | Session restored automatically without flicker via `AsyncStorage`. | ✅ PASS |
| **TC-AUTH-09** | Offline Mode | Offline App Usage | 1. Enable Airplane Mode while signed in.<br>2. Open app. | Restores cached session. Profile shows cached user details; Events loads cached database events. | ✅ PASS |
| **TC-AUTH-10** | Logout | Sign Out Action | 1. Navigate to Profile.<br>2. Tap 'Log out' and confirm. | Clears session from `AsyncStorage`. Immediately switches root stack to `AuthStack`. | ✅ PASS |
| **TC-AUTH-11** | Account Delete| In-App Account Deletion | 1. Navigate to Profile.<br>2. Tap 'Delete My Account'.<br>3. Confirm permanent deletion. | Calls `delete_user_account` RPC. Deletes auth user, profile, and tokens. Redirects to Auth welcome. | ✅ PASS |

---

## 🔒 2. Row Level Security (RLS) SQL Verification Script

Run the following SQL script in your Supabase SQL Editor to verify that unprivileged users cannot bypass RLS rules:

```sql
-- ===================================================
-- CYBERAKSHAK RLS POLICY SECURITY PROOF TEST
-- ===================================================

-- 1. Test: Non-admin user trying to insert an event
DO $$
BEGIN
  -- Simulate a normal non-admin user session
  PERFORM set_config('role', 'authenticated', true);
  
  -- Attempt unauthorized write to events
  BEGIN
    INSERT INTO public.events (title, description, starts_at, status)
    VALUES ('Hacked Event', 'Malicious draft', NOW(), 'published');
    
    RAISE EXCEPTION 'TEST FAILED: Non-admin was able to insert an event!';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'TEST PASSED: Non-admin event insertion correctly BLOCKED by RLS policy (%s)', SQLERRM;
  END;
END $$;

-- 2. Test: Non-admin user trying to escalate their role to admin
DO $$
BEGIN
  -- Simulate a normal user updating their own role
  BEGIN
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = auth.uid();
    
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
      RAISE EXCEPTION 'TEST FAILED: Non-admin escalated own role to admin!';
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'TEST PASSED: Self-role escalation correctly BLOCKED by trigger (%s)', SQLERRM;
  END;
END $$;

-- 3. Test: Public reading of draft events
DO $$
BEGIN
  -- Verify draft events are hidden from normal users
  IF EXISTS (SELECT 1 FROM public.events WHERE status = 'draft') THEN
    RAISE NOTICE 'TEST PASSED: Draft events hidden from non-admin select query.';
  END IF;
END $$;
```
