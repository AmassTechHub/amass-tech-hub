"use client"

import Link from "next/link"
import { Calendar, User } from "lucide-react"
import { useEffect, useState } from "react"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image?: string
  categories: {
    name: string
    color: string
  }[]
  authors: {
    name: string
  }
  published_at?: string
  created_at: string
  views: number
}

export default function NewsGrid() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/articles?limit=4')
        const data = await response.json()
        setArticles(data.articles || [])
      } catch (error) {
        console.error('Error fetching articles:', error)
        // Fallback to empty array if API fails
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No articles available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/news/${article.slug}`}
          className="group block"
        >
          <div className="bg-card dark:bg-gray-800 rounded-lg overflow-hidden border border-border dark:border-gray-700 hover:shadow-lg transition-all">
            <div className="aspect-video overflow-hidden">
            <img
                src={article.featured_image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span 
                  className="px-2 py-1 text-xs font-semibold rounded-full"
                  style={{ 
                    backgroundColor: (article.categories && article.categories.length > 0 && article.categories[0]?.color) ? `${article.categories[0].color}20` : '#3c0a6b20', 
                    color: (article.categories && article.categories.length > 0 && article.categories[0]?.color) || '#3c0a6b'
                  }}
                >
                  {(article.categories && article.categories.length > 0 && article.categories[0]?.name) || 'Uncategorized'}
            </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  {formatDate(article.published_at || article.created_at)}
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-accent transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-muted-foreground dark:text-gray-400 text-sm line-clamp-3 mb-4">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                  <User size={12} />
                  {article.authors.name}
                </div>
                <span>{article.views} views</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}