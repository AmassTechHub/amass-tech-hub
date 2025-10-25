"use client"

import Link from "next/link"
import { Flame } from "lucide-react"

export default function TrendingSection() {
  const trending = [
    { id: 1, tag: "Artificial Intelligence", count: "2,341" },
    { id: 2, tag: "Web Development", count: "1,892" },
    { id: 3, tag: "Cloud Computing", count: "1,654" },
    { id: 4, tag: "Cybersecurity", count: "1,432" },
    { id: 5, tag: "Mobile Apps", count: "1,203" },
    { id: 6, tag: "DevOps", count: "987" },
  ]

  return (
    <section className="py-16 md:py-24 bg-background dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <Flame size={24} className="text-primary dark:text-accent" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">Trending Topics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trending.map((topic) => (
            <Link
              key={topic.id}
              href={`/news?tag=${topic.tag}`}
              className="p-4 bg-card dark:bg-gray-900 rounded-lg border border-border dark:border-gray-800 hover:border-primary dark:hover:border-accent hover:shadow-md transition-all text-center"
            >
              <p className="font-semibold text-foreground dark:text-white mb-2">{topic.tag}</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400">{topic.count} articles</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
