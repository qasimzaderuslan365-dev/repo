
import { createClient } from '@supabase/supabase-js';

const getCredential = (key: string) => {
  if (typeof window === 'undefined') return undefined;
  
  // Direct project credentials as fallback
  const hardcoded = {
    'SUPABASE_URL': 'https://mpruappfgvozmnanywfc.supabase.co',
    'SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wcnVhcHBmZ3Zvem1uYW55d2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjAzNzUsImV4cCI6MjA4NTUzNjM3NX0.tX5xYN1csIHCXiM1NBMG-rhR-jwFGJ_OCl-egCQYa_w'
  };

  return (
    (typeof process !== 'undefined' && process.env && (process.env as any)[key]) ||
    localStorage.getItem(key) ||
    (hardcoded as any)[key] ||
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
