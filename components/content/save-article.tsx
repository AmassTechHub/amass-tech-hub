"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"

interface SaveArticleProps {
  articleId: string
  articleTitle: string
}

export default function SaveArticle({ articleId, articleTitle }: SaveArticleProps) {
  const { data: session } = useSession()
  const user = session?.user
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    setLoading(true)
    try {
      const newSavedArticles = isSaved
        ? user.preferences.savedArticles.filter((id) => id !== articleId)
        : [...user.preferences.savedArticles, articleId]

      await updatePreferences({
        ...user.preferences,
        savedArticles: newSavedArticles,
      })

      setIsSaved(!isSaved)
    } catch (error) {
      console.error("Failed to save article:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
        isSaved ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <span>{isSaved ? "✓" : "📌"}</span>
      {isSaved ? "Saved" : "Save"}
    </button>
  )
}
