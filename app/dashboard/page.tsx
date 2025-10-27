"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session?.user) {
    return null
  }

  const user = session.user

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {(user.name || user.email || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-900">{user.name || "User"}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Articles Read</p>
              <p className="text-2xl font-bold text-purple-900">0</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Saved Articles</p>
              <p className="text-2xl font-bold text-yellow-900">0</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Comments</p>
              <p className="text-2xl font-bold text-purple-900">0</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Referrals</p>
              <p className="text-2xl font-bold text-yellow-900">0</p>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-bold text-purple-900 mb-4">Membership</h2>
            <p className="text-gray-600 mb-4">
              Current Plan: <span className="font-bold capitalize">Free</span>
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
