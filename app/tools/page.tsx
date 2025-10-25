"use client"

import { useState } from "react"
import { Search, Filter, ExternalLink, Star } from "lucide-react"

export default function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Development", "Design", "Productivity", "Analytics", "Security"]

  const tools = [
    {
      id: 1,
      name: "VS Code",
      category: "Development",
      description: "Lightweight but powerful code editor with extensive plugin ecosystem",
      rating: 4.9,
      url: "https://code.visualstudio.com",
      image: "/vs-code-editor.jpg",
    },
    {
      id: 2,
      name: "Figma",
      category: "Design",
      description: "Collaborative design tool for UI/UX design and prototyping",
      rating: 4.8,
      url: "https://figma.com",
      image: "/figma-design-interface.png",
    },
    {
      id: 3,
      name: "Notion",
      category: "Productivity",
      description: "All-in-one workspace for notes, databases, and project management",
      rating: 4.7,
      url: "https://notion.so",
      image: "/notion-workspace.png",
    },
    {
      id: 4,
      name: "GitHub",
      category: "Development",
      description: "Version control and collaboration platform for developers",
      rating: 4.9,
      url: "https://github.com",
      image: "/github-version-control.jpg",
    },
    {
      id: 5,
      name: "Google Analytics",
      category: "Analytics",
      description: "Web analytics platform for tracking website performance and user behavior",
      rating: 4.6,
      url: "https://analytics.google.com",
      image: "/google-analytics-dashboard.png",
    },
    {
      id: 6,
      name: "1Password",
      category: "Security",
      description: "Password manager and digital vault for secure credential storage",
      rating: 4.8,
      url: "https://1password.com",
      image: "/password-manager-security.png",
    },
  ]

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tech Tools</h1>
          <p className="text-lg text-white/90">Curated collection of essential tools for developers and designers</p>
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
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="group flex flex-col h-full bg-card rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={tool.image || "/placeholder.svg"}
                      alt={tool.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col">
                    <span className="inline-block w-fit px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded mb-2">
                      {tool.category}
                    </span>
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-1">{tool.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(tool.rating) ? "fill-accent text-accent" : "text-muted"}
                          />
                        ))}
                        <span className="text-xs font-semibold text-foreground ml-1">{tool.rating}</span>
                      </div>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <ExternalLink size={18} className="text-primary" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No tools found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
