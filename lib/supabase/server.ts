import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

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
  sameSite?: 'lax' | 'strict' | 'none' | boolean
}

// Regular server component client
export function createServerClient() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your environment variables.'
    )
  }

  const cookieOptions = {
    get(name: string) {
      return cookieStore.get(name)?.value
    },
    set(name: string, value: string, options: Partial<Omit<CookieOptions, 'name' | 'value'>> = {}) {
      cookieStore.set({ 
        name, 
        value, 
        ...options,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      })
    },
    remove(name: string, options: Partial<Omit<CookieOptions, 'name' | 'value'>> = {}) {
      cookieStore.set({ 
        name, 
        value: '', 
        ...options,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0
      })
    }
  }

  return createSupabaseServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name: string) => cookieOptions.get(name),
      set: (name: string, value: string, options: any) => 
        cookieOptions.set(name, value, options),
      remove: (name: string, options: any) => 
        cookieOptions.remove(name, options)
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
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

  const cookieOptions = {
    get: (name: string) => '',
    set: (name: string, value: string, options: any) => {},
    remove: (name: string, options: any) => {}
  }

  return createSupabaseServerClient<Database>(supabaseUrl, supabaseServiceKey, {
    cookies: {
      get: (name: string) => cookieOptions.get(name),
      set: (name: string, value: string, options: any) => 
        cookieOptions.set(name, value, options),
      remove: (name: string, options: any) => 
        cookieOptions.remove(name, options)
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      flowType: 'pkce',
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
    .single<{ role: string }>()
    
  if (error) {
    console.error('Error checking admin status:', error)
    return false
  }
  
  return data?.role === 'admin'
}
