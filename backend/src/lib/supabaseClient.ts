import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.DATABASE_URL!,
  process.env.DATABASE_KEY!
);

export default supabase;
