// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// ✅ Type-safe cookie helper
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

// ✅ Factory for authenticated SSR client
export function createServerClientTyped() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.")
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
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

// ✅ Factory for Supabase Service Role (admin)
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.")
  }

  return createServerClient<Database>(supabaseUrl, serviceRoleKey, {
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

// ✅ Get current authenticated user (SSR-safe)
export async function getCurrentUser() {
  const supabase = createServerClientTyped()
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error("Error getting session:", error)
    return null
  }

  return data.session?.user ?? null
}

// ✅ Check if user is admin
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
