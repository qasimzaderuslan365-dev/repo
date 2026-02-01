
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Try process.env first, then fallback to localStorage
const getCredential = (key: string) => {
  return process.env[key] || localStorage.getItem(key);
};

const supabaseUrl = getCredential('SUPABASE_URL');
const supabaseAnonKey = getCredential('SUPABASE_ANON_KEY');

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

// Helper to save credentials locally for development
export const saveSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('SUPABASE_URL', url);
  localStorage.setItem('SUPABASE_ANON_KEY', key);
  window.location.reload(); // Reload to re-initialize the client
};
