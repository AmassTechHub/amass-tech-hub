import { createBrowserClient, createServerClient as createServerClientHelper } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '../types/supabase'

// Helper to handle cookies in Next.js 16+
const createCookieHandler = () => {
  return {
    get: (name: string) => {
      const cookieStore = cookies()
      return cookieStore.get(name)?.value
    },
    set: (name: string, value: string, options: any) => {
      try {
        const cookieStore = cookies()
        cookieStore.set({ name, value, ...options, path: '/' })
      } catch (error) {
        console.error('Error setting cookie:', error)
      }
    },
    remove: (name: string, options: any) => {
      try {
        const cookieStore = cookies()
        cookieStore.set({ name, value: '', ...options, maxAge: 0, path: '/' })
      } catch (error) {
        console.error('Error removing cookie:', error)
      }
    },
  }
}

// Public client for client components
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your environment variables.'
    )
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
}

// Server component client
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your environment variables.'
    )
  }

  const cookieHandler = createCookieHandler()

  return createServerClientHelper<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: cookieHandler
  })
}

// Admin client for server-side operations
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check your environment variables.'
    )
  }

  const cookieHandler = createCookieHandler()

  return createServerClientHelper<Database>(supabaseUrl, supabaseServiceKey, {
    cookies: cookieHandler,
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'x-supabase-admin': 'true'
      }
    }
  })
}

// Helper function to get the current user's session
export async function getCurrentUser() {
  const supabase = createServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  
  return session?.user ?? null
}

// Helper function to check if user is admin
export async function isUserAdmin() {
  const user = await getCurrentUser()
  if (!user) return false
  
  const { data, error } = await createServerClient()
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (error) {
    console.error('Error checking admin status:', error)
    return false
  }
  
  return data?.role === 'admin'
}
