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
  sameSite?: 'lax' | 'strict' | 'none'
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
      return Promise.resolve()
    },
    remove(name: string, options: Partial<Omit<CookieOptions, 'name' | 'value'>> = {}) {
      cookieStore.set({ 
        name, 
        value: '', 
        ...options, 
        maxAge: 0,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      })
      return Promise.resolve()
    },
  }
  
  return createSupabaseServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: cookieOptions,
      cookieOptions: {
        name: 'sb-auth-token',
        lifetime: 60 * 60 * 24 * 7, // 7 days
        domain: '',
        path: '/',
        sameSite: 'lax'
      }
    }
  )
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

  return createServerClientHelper<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error('Error setting cookie:', error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch (error) {
            console.error('Error removing cookie:', error)
          }
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          'x-supabase-admin': 'true'
        }
      }
    }
  )
}

// Helper function to get the current user's session
export async function getCurrentUser() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user ?? null
}

// Helper function to check if user is admin
export async function isUserAdmin() {
  const user = await getCurrentUser()
  if (!user) return false
  
  const { data } = await createServerClient()
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
    
  return data?.role === 'admin'
}
