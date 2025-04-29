import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_DATABASE_URL;
const supabaseKey = process.env.VITE_DATABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
