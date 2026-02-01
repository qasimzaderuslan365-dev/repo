import { createClient } from '@supabase/supabase-js';

const getCredential = (key: string) => {
  if (typeof window === 'undefined') return undefined;
  
  // Try process.env (defined in vite.config.ts) first, then fallback to localStorage
  return (
    (typeof process !== 'undefined' && process.env && (process.env as any)[key]) ||
    localStorage.getItem(key) ||
    undefined
  );
};

const supabaseUrl = getCredential('SUPABASE_URL');
const supabaseAnonKey = getCredential('SUPABASE_ANON_KEY');

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

export const saveSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('SUPABASE_URL', url);
    localStorage.setItem('SUPABASE_ANON_KEY', key);
    window.location.reload();
  }
};