import { createClient } from "@supabase/supabase-js";

// Service role client for server-side admin operations
// This bypasses RLS policies - use carefully!
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
