import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔍 Checking environment variables...")
        console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL)
        console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? "✅ Loaded" : "❌ Missing")
        console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "✅ Loaded" : "❌ Missing")

        if (!credentials?.email || !credentials?.password) return null

        const adminEmail = process.env.ADMIN_EMAIL || "admin@amasstechhub.com"
        const adminPassword = process.env.ADMIN_PASSWORD || "AmassTech2024!"

        // Simple admin login
        if (
          credentials.email.trim().toLowerCase() === adminEmail.toLowerCase() &&
          credentials.password === adminPassword
        ) {
          return {
            id: "admin",
            email: adminEmail,
            name: "Admin",
            role: "admin", // ✅ Critical for middleware
          }
        }

        console.log("❌ Invalid credentials attempt:", credentials.email)
        return null
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    // Persist role in the token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "user"
      }
      // Ensure the token always carries a role
      if (!token.role) {
        token.role = "user"
      }
      return token
    },

    // Make role available in the session
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub,
        role: token.role || "user",
      }
      return session
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "fallback-secret-key-change-in-production",

  debug: process.env.NODE_ENV === "development",
}

export default NextAuth(authOptions)
