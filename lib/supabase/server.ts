import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Type for cookie options
interface CookieOptions {
  name: string
  value: string
  expires?: Date
  maxAge?: number
  domain?: string
  path?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: "lax" | "strict" | "none" | boolean
}

/* -------------------------------------------------------------------------- */
/* ✅ Create Supabase client for regular server-side components or routes     */
/* -------------------------------------------------------------------------- */
export function createServerClientTyped() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your environment variables."
    )
  }

  return createSupabaseServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: Partial<CookieOptions> = {}) => {
        cookieStore.set({
          name,
          value,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          ...options,
        })
      },
      remove: (name: string, options: Partial<CookieOptions> = {}) => {
        cookieStore.set({
          name,
          value: "",
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 0,
          ...options,
        })
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

/* -------------------------------------------------------------------------- */
/* ✅ Create Supabase admin client using Service Role key                     */
/* -------------------------------------------------------------------------- */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check your environment variables."
    )
  }

  return createSupabaseServerClient<Database>(supabaseUrl, supabaseServiceKey, {
    cookies: {
      get: () => "",
      set: () => {},
      remove: () => {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "x-supabase-admin": "true",
      },
    },
  })
}

/* -------------------------------------------------------------------------- */
/* ✅ Get currently logged-in user (SSR-safe)                                 */
/* -------------------------------------------------------------------------- */
export async function getCurrentUser() {
  const supabase = createServerClientTyped()
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error("Error getting session:", error)
    return null
  }

  return data.session?.user ?? null
}

/* -------------------------------------------------------------------------- */
/* ✅ Check if a user is an admin                                             */
/* -------------------------------------------------------------------------- */
export async function isUserAdmin() {
  const user = await getCurrentUser()
  if (!user) return false

  const supabase = createServerClientTyped()
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<{ role: string }>()

  if (error) {
    console.error("Error checking admin status:", error)
    return false
  }

  return data?.role === "admin"
}

/* -------------------------------------------------------------------------- */
/* ✅ Backward compatibility: allow imports that use createServerClient()     */
/* -------------------------------------------------------------------------- */
export { createServerClientTyped as createServerClient }
