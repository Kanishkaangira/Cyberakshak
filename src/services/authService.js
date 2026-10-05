import { supabase, isSupabaseConfigured } from './supabaseClient';
import { GOOGLE_WEB_CLIENT_ID } from '../config/secrets';
import {
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';

function logGoogleSigninDiagnostic(stage, error) {
  if (!__DEV__) return;

  console.warn('[GoogleSignin]', stage, {
    code: error?.code,
    message: error?.message,
    nativeCause: error?.cause?.message || error?.cause || error?.nativeStackAndroid,
  });
}

/**
 * Configure Google Sign-In natively on launch if web client ID is present.
 */
let googleSigninConfigured = false;
export function initGoogleSignin() {
  if (googleSigninConfigured) return;
  try {
    const { GoogleSignin } = require('@react-native-google-signin/google-signin');
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
    });
    googleSigninConfigured = true;
  } catch (e) {
    console.warn('[AuthService] GoogleSignin native module warning:', e);
  }
}

/**
 * Email + Password Sign Up with 6-digit OTP
 */
export async function signUpWithEmail({ fullName, email, password, phone, city, state }) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured yet. Please set SUPABASE_URL and SUPABASE_ANON_KEY in src/config/secrets.js.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone || null,
        city: city || null,
        state: state || null,
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Verify 6-digit OTP code for Email Verification (Signup or Recovery)
 */
export async function verifyOTP({ email, token, type = 'signup' }) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase configuration missing.');
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type, // 'signup' | 'recovery' | 'email_change'
  });

  if (error) throw error;
  return data;
}

/**
 * Resend OTP Code with cooldown management
 */
export async function resendOTP({ email, type = 'signup' }) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase configuration missing.');
  }

  const { data, error } = await supabase.auth.resend({
    email,
    type,
  });

  if (error) throw error;
  return data;
}

/**
 * Login with Email & Password
 */
export async function signInWithEmail({ email, password }) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured yet. Please set SUPABASE_URL and SUPABASE_ANON_KEY in src/config/secrets.js.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Send Password Reset Email / OTP
 */
export async function sendPasswordReset({ email }) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase configuration missing.');
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
}

/**
 * Set New Password after OTP verification
 */
export async function updatePassword({ newPassword }) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase configuration missing.');
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
}

/**
 * Native Google Sign-In with ID Token
 */
export async function signInWithGoogle() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured yet. Please set SUPABASE_URL and SUPABASE_ANON_KEY in src/config/secrets.js.');
  }

  if (
    !GOOGLE_WEB_CLIENT_ID ||
    GOOGLE_WEB_CLIENT_ID.includes('placeholder') ||
    GOOGLE_WEB_CLIENT_ID.startsWith('00000000')
  ) {
    throw new Error(
      'Google Sign-In is not ready. Please copy your real Google OAuth Web Client ID from Google Cloud Console into src/config/secrets.js.'
    );
  }

  try {
    initGoogleSignin();
    const {
      GoogleSignin,
      isCancelledResponse,
      isSuccessResponse,
    } = require('@react-native-google-signin/google-signin');
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const signInResult = await GoogleSignin.signIn();

    if (isCancelledResponse(signInResult)) {
      throw new Error('Google sign-in was cancelled.');
    }

    if (!isSuccessResponse(signInResult)) {
      throw new Error('Google sign-in did not complete. Please try again.');
    }

    let idToken =
      signInResult.data?.idToken ||
      signInResult.idToken ||
      signInResult.data?.id_token ||
      signInResult.id_token;

    if (!idToken) {
      try {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      } catch (tokenErr) {
        logGoogleSigninDiagnostic('getTokens failed', tokenErr);
      }
    }

    if (!idToken) {
      throw new Error(
        'Google returned an account selection, but no ID token was issued. Ensure SHA-1 fingerprint is added in Firebase project cyberakshak-c02c2.'
      );
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) throw error;
    return data;
  } catch (e) {
    logGoogleSigninDiagnostic('sign-in failed', e);

    if (e.message === 'Google sign-in was cancelled.') {
      throw new Error('Google sign-in was cancelled.');
    }

    if (isErrorWithCode?.(e)) {
      if (e.code === statusCodes.IN_PROGRESS) {
        throw new Error('Google sign-in is already in progress.');
      }
      if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play services are unavailable or need updating.');
      }
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Google sign-in was cancelled.');
      }
    }

    throw e;
  }
}

/**
 * Sign Out
 */
export async function signOut() {
  if (!isSupabaseConfigured()) return;
  try {
    const { GoogleSignin } = require('@react-native-google-signin/google-signin');
    await GoogleSignin.signOut().catch(() => {});
  } catch (e) {
    /* ignore */
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Fetch Signed-In User Profile from `profiles` table
 */
export async function getCurrentUserProfile() {
  if (!isSupabaseConfigured()) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.warn('[AuthService] Profile fetch error:', error);
  }

  return profile || {
    id: user.id,
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    email: user.email,
    phone: user.user_metadata?.phone || '',
    avatar_url: user.user_metadata?.avatar_url || '',
    city: user.user_metadata?.city || '',
    state: user.user_metadata?.state || '',
    preferred_language: user.user_metadata?.preferred_language || 'English',
    role: 'user',
  };
}

/**
 * Update Current User Profile
 */
export async function updateUserProfile(updates) {
  if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete User Account (Google Play Compliance)
 */
export async function deleteUserAccount() {
  if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

  const { error } = await supabase.rpc('delete_user_account');
  if (error) throw error;

  await signOut();
}
