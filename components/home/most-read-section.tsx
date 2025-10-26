"use client"

import Link from "next/link"
import { TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface Article {
  id: string
  title: string
  slug: string
  views: number
}

export default function MostReadSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMostReadArticles() {
      try {
        const response = await fetch('/api/articles?limit=3')
        const data = await response.json()
        // Sort by views and take top 3
        const sortedArticles = (data.articles || [])
          .sort((a: Article, b: Article) => b.views - a.views)
          .slice(0, 3)
        setArticles(sortedArticles)
      } catch (error) {
        console.error('Error fetching most read articles:', error)
        // Fallback to empty array if API fails
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchMostReadArticles()
  }, [])

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  if (loading) {
    return (
      <section className="py-8 bg-card dark:bg-gray-900 border-b border-border dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-primary dark:text-accent" />
            <h3 className="text-lg font-semibold text-foreground dark:text-white">Most Read</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (articles.length === 0) {
    return (
      <section className="py-8 bg-card dark:bg-gray-900 border-b border-border dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-primary dark:text-accent" />
            <h3 className="text-lg font-semibold text-foreground dark:text-white">Most Read</h3>
          </div>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No articles available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-card dark:bg-gray-900 border-b border-border dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={20} className="text-primary dark:text-accent" />
          <h3 className="text-lg font-semibold text-foreground dark:text-white">Most Read</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-background dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-2xl font-bold text-primary dark:text-accent min-w-fit">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground dark:text-white line-clamp-2 hover:text-primary dark:hover:text-accent transition-colors">
                  {article.title}
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">{formatViews(article.views)} views</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}