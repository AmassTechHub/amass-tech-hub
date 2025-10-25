"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Comment } from "@/lib/types"

interface CommentsSectionProps {
  articleId: string
  comments: Comment[]
}

export default function CommentsSection({ articleId, comments: initialComments }: CommentsSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    if (!newComment.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          content: newComment,
        }),
      })

      if (response.ok) {
        const comment = await response.json()
        setComments([comment, ...comments])
        setNewComment("")
      }
    } catch (error) {
      console.error("Failed to post comment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-8 border-t">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">Comments ({comments.length})</h2>

      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8 bg-gray-50 p-4 rounded-lg">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
            rows={4}
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="mt-3 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="mb-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-gray-700">
            <a href="/auth/login" className="text-purple-600 hover:underline font-medium">
              Login
            </a>{" "}
            to join the discussion
          </p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <img
                src={comment.author.avatar || "/placeholder.svg"}
                alt={comment.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{comment.author.name}</h4>
                <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
              <button className="text-gray-400 hover:text-red-600">♥ {comment.likes}</button>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
