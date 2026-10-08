import { supabase, isSupabaseConfigured } from './supabaseClient';
import { removeCurrentDeviceToken } from './pushNotificationService';

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
 * Sign Out
 */
export async function signOut() {
  if (!isSupabaseConfigured()) return;
  try {
    await removeCurrentDeviceToken();
  } catch (cleanupError) {
    console.warn(
      '[AuthService] Could not unregister the push token before sign out:',
      cleanupError
    );
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
 * Delete User Account
 */
export async function deleteUserAccount() {
  if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

  const { error } = await supabase.rpc('delete_user_account');
  if (error) throw error;

  await signOut();
}
