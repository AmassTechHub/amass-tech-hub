"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

interface SearchResult {
  id: string
  title: string
  type: "article" | "review" | "tutorial" | "tool"
  excerpt: string
  url: string
  image?: string
  date?: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "article" | "review" | "tutorial" | "tool">("all")

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  const filteredResults = filter === "all" ? results : results.filter((r) => r.type === filter)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-900 mb-2">Search Results</h1>
        <p className="text-gray-600 mb-8">{query ? `Results for "${query}"` : "Enter a search query"}</p>

        {query && (
          <div className="mb-8 flex flex-wrap gap-2">
            {["all", "article", "review", "tutorial", "tool"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-purple-600"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Searching...</p>
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <a
                key={result.id}
                href={result.url}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex items-start gap-4">
                  {result.image && (
                    <img
                      src={result.image || "/placeholder.svg"}
                      alt={result.title}
                      className="w-24 h-24 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-purple-900">{result.title}</h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                        {result.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{result.excerpt}</p>
                    {result.date && <p className="text-sm text-gray-500">{result.date}</p>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No results found</p>
          </div>
        )}
      </div>
    </div>
  )
}
