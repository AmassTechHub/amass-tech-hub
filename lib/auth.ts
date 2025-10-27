import NextAuth from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabaseAdmin } from "@/lib/supabase"

export const authOptions = {
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key',
  }),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Simple admin authentication - in production, use proper password hashing
        const adminEmail = process.env.ADMIN_EMAIL || "admin@amasstechhub.com"
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          return {
            id: "admin",
            email: adminEmail,
            name: "Admin",
            role: "admin"
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || 'temp-secret-for-development',
}

export default NextAuth(authOptions)
