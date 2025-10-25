"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Lightbulb } from "lucide-react"

export default function RecommendedSection() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const recommended = [
    { id: 1, title: "Advanced React Patterns You Should Know", category: "Tutorial" },
    { id: 2, title: "Building Scalable APIs with Node.js", category: "Tutorial" },
    { id: 3, title: "The Complete Guide to TypeScript", category: "Guide" },
  ]

  return (
    <section className="py-16 md:py-24 bg-card dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <Lightbulb size={24} className="text-primary dark:text-accent" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">Recommended For You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommended.map((item) => (
            <Link
              key={item.id}
              href={`/content/${item.id}`}
              className="p-6 bg-background dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700 hover:border-primary dark:hover:border-accent hover:shadow-lg transition-all"
            >
              <span className="inline-block px-3 py-1 bg-primary/10 dark:bg-purple-900/30 text-primary dark:text-accent text-xs font-semibold rounded-full mb-3">
                {item.category}
              </span>
              <h3 className="font-semibold text-foreground dark:text-white hover:text-primary dark:hover:text-accent transition-colors">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
