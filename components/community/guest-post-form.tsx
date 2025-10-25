"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function GuestPostForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Startup News",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/guest-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ title: "", excerpt: "", content: "", category: "Startup News" })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      console.error("Failed to submit guest post:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">Submit a Guest Post</h2>

      {submitted && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          Thank you for your submission! Our editorial team will review it shortly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option>Startup News</option>
            <option>Infrastructure</option>
            <option>AI & Tech</option>
            <option>Security</option>
            <option>Fintech</option>
            <option>Cloud</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
            rows={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
        >
          {loading ? "Submitting..." : "Submit Guest Post"}
        </button>
      </form>
    </div>
  )
}
