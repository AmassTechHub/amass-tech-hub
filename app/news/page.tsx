"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import NewsCard from "@/components/news/news-card"

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Startup News", "Infrastructure", "AI & Tech", "Security", "Fintech", "Cloud"]

  const allNews = [
    {
      id: 1,
      title: "African Tech Startups Raise Record $2.5B in 2024",
      excerpt: "Investment in African tech ecosystem reaches all-time high, signaling strong growth potential",
      category: "Startup News",
      date: "Oct 20, 2025",
      author: "Sarah Okonkwo",
      image: "/african-tech-startup-funding.jpg",
      content:
        "The African tech startup ecosystem has reached a significant milestone with total investments hitting $2.5 billion in 2024. This represents a 40% increase from the previous year, demonstrating growing confidence from global and local investors in African innovation.",
    },
    {
      id: 2,
      title: "5G Rollout Accelerates Across Major African Cities",
      excerpt: "Telecommunications companies announce aggressive expansion plans for next-generation connectivity",
      category: "Infrastructure",
      date: "Oct 18, 2025",
      author: "James Mwangi",
      image: "/5g-network-infrastructure.jpg",
      content:
        "Major telecommunications providers across Africa are accelerating their 5G network deployments. By the end of 2025, over 50 major cities are expected to have 5G coverage, transforming mobile connectivity and enabling new applications.",
    },
    {
      id: 3,
      title: "AI Integration in African Healthcare: Opportunities and Challenges",
      excerpt: "Exploring how artificial intelligence is transforming medical services across the continent",
      category: "AI & Tech",
      date: "Oct 19, 2025",
      author: "Amara Obi",
      image: "/ai-healthcare-africa.jpg",
      content:
        "Artificial intelligence is revolutionizing healthcare delivery in Africa. From diagnostic imaging to drug discovery, AI applications are improving patient outcomes while addressing the continent's healthcare challenges.",
    },
    {
      id: 4,
      title: "Cybersecurity Best Practices for African Businesses",
      excerpt: "Essential security measures every organization should implement in 2025",
      category: "Security",
      date: "Oct 17, 2025",
      author: "David Kipchoge",
      image: "/cybersecurity-business.jpg",
      content:
        "As cyber threats evolve, African businesses must adopt comprehensive security strategies. This includes employee training, regular security audits, and implementation of zero-trust architecture.",
    },
    {
      id: 5,
      title: "The Rise of Fintech in East Africa",
      excerpt: "How digital financial services are revolutionizing banking and payments",
      category: "Fintech",
      date: "Oct 16, 2025",
      author: "Sarah Okonkwo",
      image: "/fintech-mobile-money.png",
      content:
        "East Africa continues to lead the continent in fintech innovation. Mobile money services, digital lending platforms, and blockchain-based solutions are providing financial inclusion to millions.",
    },
    {
      id: 6,
      title: "Cloud Computing Adoption Trends in 2025",
      excerpt: "African enterprises increasingly migrate to cloud infrastructure for scalability",
      category: "Cloud",
      date: "Oct 15, 2025",
      author: "James Mwangi",
      image: "/cloud-computing-datacenter.png",
      content:
        "Cloud adoption among African enterprises is accelerating, with companies recognizing the benefits of scalability, cost efficiency, and global accessibility. Major cloud providers are expanding their African data centers.",
    },
  ]

  const filteredNews = allNews.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tech News</h1>
          <p className="text-lg text-white/90">Stay informed with the latest developments in African tech</p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Filter */}
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

      {/* News Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
