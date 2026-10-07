import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/secrets';

const validUrl = typeof SUPABASE_URL === 'string' && SUPABASE_URL.startsWith('http');
const validKey = typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 10;

const dummyStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};

export const supabase = createClient(
  validUrl ? SUPABASE_URL : 'https://placeholder.supabase.co',
  validKey ? SUPABASE_ANON_KEY : 'placeholder-key',
  {
    auth: {
      storage: AsyncStorage || dummyStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export const isSupabaseConfigured = () => validUrl && validKey && !SUPABASE_URL.includes('placeholder');
