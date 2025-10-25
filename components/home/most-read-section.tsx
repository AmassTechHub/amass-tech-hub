"use client"

import Link from "next/link"
import { TrendingUp } from "lucide-react"

export default function MostReadSection() {
  const mostRead = [
    { id: 1, title: "How AI is Transforming African Businesses", views: "12.5K" },
    { id: 2, title: "The Future of Mobile Development in 2025", views: "9.8K" },
    { id: 3, title: "Cybersecurity Best Practices for Startups", views: "8.3K" },
  ]

  return (
    <section className="py-8 bg-card dark:bg-gray-900 border-b border-border dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={20} className="text-primary dark:text-accent" />
          <h3 className="text-lg font-semibold text-foreground dark:text-white">Most Read</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mostRead.map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-background dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-2xl font-bold text-primary dark:text-accent min-w-fit">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground dark:text-white line-clamp-2 hover:text-primary dark:hover:text-accent transition-colors">
                  {article.title}
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">{article.views} views</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
