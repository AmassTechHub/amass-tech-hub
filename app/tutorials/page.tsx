"use client"

import { useState } from "react"
import { Search, Filter, Clock, Zap } from "lucide-react"
import Link from "next/link"

export default function TutorialsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")

  const levels = ["all", "Beginner", "Intermediate", "Advanced"]

  const tutorials = [
    {
      id: 1,
      title: "Getting Started with React Hooks",
      excerpt: "Learn the fundamentals of React Hooks and how to use them in your projects",
      level: "Beginner",
      duration: "45 min",
      author: "Sarah Okonkwo",
      date: "Oct 20, 2025",
      image: "/react-hooks-javascript.jpg",
    },
    {
      id: 2,
      title: "Building Scalable Node.js Applications",
      excerpt: "Best practices for building production-ready Node.js applications",
      level: "Advanced",
      duration: "2 hours",
      author: "James Mwangi",
      date: "Oct 19, 2025",
      image: "/nodejs-backend-development.jpg",
    },
    {
      id: 3,
      title: "CSS Grid Layout Mastery",
      excerpt: "Master CSS Grid for creating complex responsive layouts",
      level: "Intermediate",
      duration: "1.5 hours",
      author: "Amara Obi",
      date: "Oct 18, 2025",
      image: "/css-grid-layout.png",
    },
    {
      id: 4,
      title: "Introduction to TypeScript",
      excerpt: "Get started with TypeScript and improve your JavaScript development",
      level: "Beginner",
      duration: "1 hour",
      author: "David Kipchoge",
      date: "Oct 17, 2025",
      image: "/typescript-programming.png",
    },
    {
      id: 5,
      title: "Advanced Python Data Analysis",
      excerpt: "Deep dive into pandas, numpy, and data visualization techniques",
      level: "Advanced",
      duration: "3 hours",
      author: "Sarah Okonkwo",
      date: "Oct 16, 2025",
      image: "/python-data-analysis.png",
    },
    {
      id: 6,
      title: "Docker Containerization Basics",
      excerpt: "Learn Docker and containerize your applications for deployment",
      level: "Intermediate",
      duration: "1.5 hours",
      author: "James Mwangi",
      date: "Oct 15, 2025",
      image: "/docker-containers.jpg",
    },
  ]

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "all" || tutorial.level === selectedLevel
    return matchesSearch && matchesLevel
  })

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
          {filteredTutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((tutorial) => (
                <Link
                  key={tutorial.id}
                  href={`/tutorials/${tutorial.id}`}
                  className="group flex flex-col h-full bg-card rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={tutorial.image || "/placeholder.svg"}
                      alt={tutorial.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
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
                        {tutorial.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={14} />
                        {tutorial.author}
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
