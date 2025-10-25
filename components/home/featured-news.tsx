import Link from "next/link"

export default function FeaturedNews() {
  const featured = [
    {
      id: 1,
      title: "African Tech Startups Raise Record $2.5B in 2024",
      excerpt: "Investment in African tech ecosystem reaches all-time high, signaling strong growth potential",
      category: "Startup News",
      date: "Oct 20, 2025",
      image: "/african-tech-startup-funding.jpg",
    },
    {
      id: 2,
      title: "5G Rollout Accelerates Across Major African Cities",
      excerpt: "Telecommunications companies announce aggressive expansion plans for next-generation connectivity",
      category: "Infrastructure",
      date: "Oct 18, 2025",
      image: "/5g-network-infrastructure.jpg",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {featured.map((article) => (
        <Link
          key={article.id}
          href={`/news/${article.id}`}
          className="group overflow-hidden rounded-lg border border-border hover:border-primary hover:shadow-xl transition-all"
        >
          <div className="relative h-64 md:h-80 overflow-hidden bg-muted">
            <img
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                  {article.category}
                </span>
                <span className="text-sm text-white/80">{article.date}</span>
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
