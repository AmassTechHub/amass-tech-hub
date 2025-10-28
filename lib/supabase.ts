import { createClient } from "@supabase/supabase-js"

// ✅ Public client (used in frontend)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your environment variables."
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ✅ Admin client (used only in API routes / server components)
const supabaseServiceUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceUrl || !supabaseServiceKey) {
  console.warn("⚠️ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — admin features may not work.")
}

export const supabaseAdmin = createClient(
  supabaseServiceUrl || supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
)
