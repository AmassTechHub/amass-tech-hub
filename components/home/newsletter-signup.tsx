"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Check, AlertCircle } from "lucide-react"
import { trackNewsletterSignup } from "@/lib/analytics"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to subscribe")
        return
      }

      trackNewsletterSignup(email)

      setSubmitted(true)
      setEmail("")
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error("[v0] Newsletter signup error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
        >
          {submitted ? <Check size={20} /> : loading ? "..." : "Subscribe"}
        </button>
      </div>
      {submitted && <p className="text-white/80 text-sm mt-3">Thanks for subscribing!</p>}
      {error && (
        <div className="flex gap-2 items-center text-red-200 text-sm mt-3">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </form>
  )
}
