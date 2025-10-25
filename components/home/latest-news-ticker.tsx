"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"

export default function LatestNewsTicker() {
  const [news, setNews] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const tickers = [
    "Breaking: New AI breakthrough announced by African tech startup",
    "Market Update: Tech stocks surge on positive earnings reports",
    "Industry News: Major cloud provider expands African data centers",
  ]

  useEffect(() => {
    setNews(tickers)
  }, [])

  useEffect(() => {
    if (news.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [news])

  return (
    <div className="bg-accent text-accent-foreground py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2 font-semibold whitespace-nowrap">
          <AlertCircle size={18} />
          LIVE
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-pulse">{news[currentIndex]}</div>
        </div>
      </div>
    </div>
  )
}
