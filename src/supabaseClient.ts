import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://okckscxsgafctgaidfrw.supabase.co";

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_KpJiwCJlObROspUFYoqHvQ_eq-T7JVQ";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
