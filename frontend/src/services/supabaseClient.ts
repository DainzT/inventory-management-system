import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_DATABASE_URL;
const supabaseKey = import.meta.env.VITE_DATABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

