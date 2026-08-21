import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase URL and anon key from environment variables
const supabaseUrl =
  (typeof import.meta !== 'undefined' && (import.meta.env?.NEXT_PUBLIC_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL)) ||
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SUPABASE_URL || process.env?.VITE_SUPABASE_URL)) ||
  '';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && (import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY)) ||
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_ANON_KEY)) ||
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Warning: Supabase URL or Anon Key is missing. Please check your .env.local or environment variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

export default supabase;
