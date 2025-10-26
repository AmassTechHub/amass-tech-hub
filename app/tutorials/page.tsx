"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Clock, Zap } from "lucide-react"
import Link from "next/link"
import { getTutorials, searchTutorials, type Tutorial } from "@/lib/content-management"

export default function TutorialsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)

  const levels = ["all", "beginner", "intermediate", "advanced"]

  useEffect(() => {
    async function loadTutorials() {
      try {
        const tutorialsData = await getTutorials()
        setTutorials(tutorialsData)
      } catch (error) {
        console.error('Error loading tutorials:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTutorials()
  }, [])

  useEffect(() => {
    async function searchTutorialsData() {
      if (searchTerm.trim()) {
        try {
          const searchResults = await searchTutorials(searchTerm)
          setTutorials(searchResults)
        } catch (error) {
          console.error('Error searching tutorials:', error)
        }
      } else {
        // Reload all tutorials when search is cleared
        try {
          const tutorialsData = await getTutorials()
          setTutorials(tutorialsData)
        } catch (error) {
          console.error('Error loading tutorials:', error)
        }
      }
    }
    searchTutorialsData()
  }, [searchTerm])

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesLevel = selectedLevel === "all" || tutorial.level === selectedLevel
    return matchesLevel
  })

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tutorials</h1>
          <p className="text-lg text-white/90">Learn tech skills with our comprehensive guides and tutorials</p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-muted-foreground" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level === "all" ? "All Levels" : level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorials Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading tutorials...</p>
            </div>
          ) : filteredTutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((tutorial) => (
                <Link
                  key={tutorial.id}
                  href={`/tutorials/${tutorial.slug}`}
                  className="group flex flex-col h-full bg-card rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={tutorial.featured_image || "/placeholder.svg"}
                      alt={tutorial.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full capitalize">
                      {tutorial.level}
                    </div>
                  </div>
                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {tutorial.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">{tutorial.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDuration(tutorial.duration)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={14} />
                        {tutorial.author.name}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No tutorials found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
