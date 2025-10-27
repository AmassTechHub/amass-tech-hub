"use client"

import Link from "next/link"
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
  }
  authors: {
    name: string
  }
  published_at?: string
  created_at: string
}

export default function FeaturedNews() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedArticles() {
      try {
        const response = await fetch('/api/articles?featured=true&limit=2')
        const data = await response.json()
        setArticles(data.articles || [])
      } catch (error) {
        console.error('Error fetching featured articles:', error)
        // Fallback to empty array if API fails
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedArticles()
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-64 md:h-80 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No featured articles available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/news/${article.slug}`}
          className="group overflow-hidden rounded-lg border border-border hover:border-primary hover:shadow-xl transition-all"
        >
          <div className="relative h-64 md:h-80 overflow-hidden bg-muted">
            <img
              src={article.featured_image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span 
                  className="px-3 py-1 text-xs font-semibold rounded-full"
                  style={{ 
                    backgroundColor: article.categories?.color ? `${article.categories.color}20` : '#3c0a6b20', 
                    color: article.categories?.color || '#3c0a6b'
                  }}
                >
                  {article.categories?.name || 'Uncategorized'}
                </span>
                <span className="text-sm text-white/80">
                  {formatDate(article.published_at || article.created_at)}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                {article.title}
              </h3>
              <p className="text-white/90 text-sm">{article.excerpt}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}