"use client"

import { shareArticle } from "@/lib/content-utils"
import { useState } from "react"

interface ShareButtonsProps {
  title: string
  url: string
  className?: string
}

export default function ShareButtons({ title, url, className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const platforms = [
    { name: "Twitter", icon: "𝕏", color: "hover:text-black" },
    { name: "LinkedIn", icon: "in", color: "hover:text-blue-700" },
    { name: "Facebook", icon: "f", color: "hover:text-blue-600" },
    { name: "WhatsApp", icon: "W", color: "hover:text-green-600" },
  ]

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="text-sm font-medium text-gray-600">Share:</span>
      <div className="flex gap-3">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => shareArticle(title, url, platform.name.toLowerCase() as any)}
            className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 transition ${platform.color}`}
            title={`Share on ${platform.name}`}
          >
            {platform.icon}
          </button>
        ))}
        <button
          onClick={handleCopyLink}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 hover:text-purple-600 transition"
          title="Copy link"
        >
          {copied ? "✓" : "🔗"}
        </button>
      </div>
    </div>
  )
}
