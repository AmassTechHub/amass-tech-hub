"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8">
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-16 h-16 rounded-full" />
            <div>
              <h1 className="text-3xl font-bold text-purple-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Articles Read</p>
              <p className="text-2xl font-bold text-purple-900">{user.stats.articlesRead}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Saved Articles</p>
              <p className="text-2xl font-bold text-yellow-900">{user.stats.articlesSaved}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Comments</p>
              <p className="text-2xl font-bold text-purple-900">{user.stats.commentsPosted}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Referrals</p>
              <p className="text-2xl font-bold text-yellow-900">{user.stats.referralsCount}</p>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-bold text-purple-900 mb-4">Membership</h2>
            <p className="text-gray-600 mb-4">
              Current Plan: <span className="font-bold capitalize">{user.stats.membershipTier}</span>
            </p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
