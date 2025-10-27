"use client"

import Link from "next/link"
import { Flame } from "lucide-react"
import { useEffect, useState } from "react"

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

export default function TrendingSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to empty array if API fails
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-background dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Flame size={24} className="text-primary dark:text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">Trending Topics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-background dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Flame size={24} className="text-primary dark:text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">Trending Topics</h2>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-background dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <Flame size={24} className="text-primary dark:text-accent" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">Trending Topics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/news?category=${category.slug}`}
              className="p-4 bg-card dark:bg-gray-900 rounded-lg border border-border dark:border-gray-800 hover:border-primary dark:hover:border-accent hover:shadow-md transition-all text-center"
            >
              <p className="font-semibold text-foreground dark:text-white mb-2">{category.name}</p>
              <div 
                className="w-3 h-3 rounded-full mx-auto"
                style={{ backgroundColor: category?.color || '#3c0a6b' }}
              ></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}