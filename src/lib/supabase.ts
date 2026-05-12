import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing environment variables: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before running.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
