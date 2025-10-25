import Leaderboard from "@/components/community/leaderboard"
import GuestPostForm from "@/components/community/guest-post-form"

export const metadata = {
  title: "Community - Amass Tech Hub",
  description: "Join our community of tech enthusiasts and contributors",
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-900 mb-2">Community</h1>
        <p className="text-gray-600 mb-12">Join thousands of tech enthusiasts and contribute to the conversation</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GuestPostForm />
          </div>
          <div>
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  )
}
