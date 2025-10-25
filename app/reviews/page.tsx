"use client"

import { useState } from "react"
import { Star, Search, Filter } from "lucide-react"
import Link from "next/link"

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Software", "Hardware", "SaaS", "Mobile Apps", "Cloud Services"]

  const reviews = [
    {
      id: 1,
      title: "Figma Review: Design Collaboration Redefined",
      product: "Figma",
      category: "Software",
      rating: 4.8,
      excerpt: "A comprehensive look at how Figma is revolutionizing design collaboration",
      author: "Sarah Okonkwo",
      date: "Oct 20, 2025",
      image: "/figma-design-tool.jpg",
    },
    {
      id: 2,
      title: "MacBook Pro M3: Performance Beast for Developers",
      product: "MacBook Pro M3",
      category: "Hardware",
      rating: 4.7,
      excerpt: "Testing the latest MacBook Pro with M3 chip for development workflows",
      author: "James Mwangi",
      date: "Oct 19, 2025",
      image: "/macbook-pro-laptop.png",
    },
    {
      id: 3,
      title: "Slack Review: Team Communication Platform",
      product: "Slack",
      category: "SaaS",
      rating: 4.6,
      excerpt: "How Slack streamlines team communication and collaboration",
      author: "Amara Obi",
      date: "Oct 18, 2025",
      image: "/slack-messaging-app.jpg",
    },
    {
      id: 4,
      title: "Notion: All-in-One Workspace Review",
      product: "Notion",
      category: "SaaS",
      rating: 4.5,
      excerpt: "Exploring Notion's powerful features for productivity and organization",
      author: "David Kipchoge",
      date: "Oct 17, 2025",
      image: "/notion-workspace.png",
    },
    {
      id: 5,
      title: "iPhone 15 Pro: Camera and Performance Analysis",
      product: "iPhone 15 Pro",
      category: "Mobile Apps",
      rating: 4.7,
      excerpt: "Deep dive into iPhone 15 Pro's camera capabilities and processing power",
      author: "Sarah Okonkwo",
      date: "Oct 16, 2025",
      image: "/iphone-15-pro.png",
    },
    {
      id: 6,
      title: "AWS vs Azure: Cloud Platform Comparison",
      product: "AWS & Azure",
      category: "Cloud Services",
      rating: 4.6,
      excerpt: "Comparing two leading cloud platforms for enterprise deployments",
      author: "James Mwangi",
      date: "Oct 15, 2025",
      image: "/cloud-computing-servers.jpg",
    },
  ]

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || review.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Reviews</h1>
          <p className="text-lg text-white/90">Expert reviews of the latest tech products and services</p>
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
                placeholder="Search reviews..."
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

      {/* Reviews Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <Link
                  key={review.id}
                  href={`/reviews/${review.id}`}
                  className="group flex flex-col h-full bg-card rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={review.image || "/placeholder.svg"}
                      alt={review.product}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col">
                    <span className="inline-block w-fit px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded mb-2">
                      {review.category}
                    </span>
                    <h3 className="font-bold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {review.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{review.product}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.floor(review.rating) ? "fill-accent text-accent" : "text-muted"}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-foreground">{review.rating}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">{review.excerpt}</p>
                    <div className="text-xs text-muted-foreground pt-4 border-t border-border">
                      {review.author} • {review.date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No reviews found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
