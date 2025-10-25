"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, AlertCircle, Check } from "lucide-react"
import { trackContactSubmission } from "@/lib/analytics"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send message")
        return
      }

      // Track contact submission
      trackContactSubmission(formData.subject)

      setSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      console.error("[v0] Contact form error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-white/90">Get in touch with our team. We'd love to hear from you.</p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <p className="text-muted-foreground">info@amasstechhub.com</p>
                <p className="text-muted-foreground">geeks@amasstechhub.com</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Phone / WhatsApp</h3>
                <p className="text-muted-foreground">+233 243 521 850</p>
                <p className="text-muted-foreground">Available 24/7</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Location</h3>
                <p className="text-muted-foreground">Kumasi, Ghana</p>
                <p className="text-muted-foreground">West Africa</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="services">Services</option>
                    <option value="advertising">Advertising</option>
                    <option value="partnership">Partnership</option>
                    <option value="support">Support</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none disabled:opacity-50"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <Send size={20} />
                    </>
                  )}
                </button>
              </form>
              {submitted && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 items-start">
                  <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-green-800 font-medium">Message sent successfully!</p>
                    <p className="text-green-700 text-sm">We'll get back to you soon.</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-red-800 font-medium">Error</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
