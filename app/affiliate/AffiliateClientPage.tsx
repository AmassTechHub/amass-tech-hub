"use client"

import type React from "react"

import { useState } from "react"

export default function AffiliateClientPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Send affiliate application
    setSubmitted(true)
    setTimeout(() => {
      setEmail("")
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">Affiliate Program</h1>
          <p className="text-xl text-gray-600">Earn commissions by promoting products and services you love</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-purple-900 mb-2">Competitive Commissions</h3>
            <p className="text-gray-600">Earn 15-30% commission on every referral, depending on the product category</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-purple-900 mb-2">Real-time Tracking</h3>
            <p className="text-gray-600">Monitor your clicks, conversions, and earnings with our detailed dashboard</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-purple-900 mb-2">Exclusive Perks</h3>
            <p className="text-gray-600">Get early access to new products and exclusive promotional materials</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">How It Works</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">Sign Up</h3>
                  <p className="text-gray-600">Apply for our affiliate program</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">Get Your Links</h3>
                  <p className="text-gray-600">Receive unique affiliate links for products</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">Promote</h3>
                  <p className="text-gray-600">Share links with your audience</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">Earn</h3>
                  <p className="text-gray-600">Get paid monthly for every conversion</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Join Our Program</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-purple-900 py-2 rounded-lg hover:bg-yellow-400 font-bold transition"
              >
                Apply Now
              </button>
              {submitted && (
                <p className="text-yellow-200 text-sm">Thank you! We'll review your application shortly.</p>
              )}
            </form>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Figma", category: "Design", commission: "20%" },
              { name: "Notion", category: "Productivity", commission: "15%" },
              { name: "Slack", category: "Communication", commission: "25%" },
              { name: "GitHub Pro", category: "Development", commission: "30%" },
            ].map((product) => (
              <div key={product.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded font-medium">
                    {product.commission}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{product.category}</p>
                <button className="text-purple-600 hover:underline font-medium text-sm">Get Affiliate Link</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
