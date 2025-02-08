import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

console.log(SUPABASE_URL)
console.log(SUPABASE_SERVICE_ROLE_KEY)

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
