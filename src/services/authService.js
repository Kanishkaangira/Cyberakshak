import { supabase, isSupabaseConfigured } from './supabaseClient';
import { removeCurrentDeviceToken } from './pushNotificationService';

export const OTP_RESEND_COOLDOWN_SECONDS = 80;

/**
 * Start email-only signup by sending a passwordless email OTP.
 */
export async function signUpWithEmail({ email }) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured yet. Please set SUPABASE_URL and SUPABASE_ANON_KEY in src/config/secrets.js.');
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: {
        profile_setup_required: true,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function resendSignupOTP({ email }) {
  return signUpWithEmail({ email });
}

export async function sendLoginOTP({ email }) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase configuration missing.');
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Verify a six-digit email OTP for signup or password recovery.
 */
export async function verifyOTP({ email, token, type = 'signup' }) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase configuration missing.');
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type, // 'email' | 'signup' | 'recovery' | 'email_change'
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

export async function completeProfileSetup({ fullName, phone, city, password }) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase configuration missing.');
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user?.email_confirmed_at) {
    throw new Error('Verify your email before completing your profile.');
  }

  const { data: updatedProfile, error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone: phone || null,
      city: city || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select('id')
    .maybeSingle();

  if (profileError) throw profileError;
  if (!updatedProfile) {
    throw new Error('Could not find your profile to complete setup.');
  }

  const { error } = await supabase.auth.updateUser({
    password,
    data: {
      full_name: fullName,
      phone: phone || null,
      city: city || null,
      profile_setup_required: false,
      profile_setup_complete: true,
    },
  });

  if (error) throw error;
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

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session?.access_token) throw new Error('You must be signed in to delete your account.');

  const { error } = await supabase.rpc('delete_user_account');
  if (error) throw error;

  const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' });
  if (signOutError) throw signOutError;
}
