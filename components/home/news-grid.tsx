import Link from "next/link"
import { Calendar, User } from "lucide-react"

export default function NewsGrid() {
  const articles = [
    {
      id: 3,
      title: "AI Integration in African Healthcare: Opportunities and Challenges",
      excerpt: "Exploring how artificial intelligence is transforming medical services across the continent",
      category: "AI & Tech",
      date: "Oct 19, 2025",
      author: "Sarah Okonkwo",
      image: "/ai-healthcare-africa.jpg",
    },
    {
      id: 4,
      title: "Cybersecurity Best Practices for African Businesses",
      excerpt: "Essential security measures every organization should implement in 2025",
      category: "Security",
      date: "Oct 17, 2025",
      author: "James Mwangi",
      image: "/cybersecurity-business.jpg",
    },
    {
      id: 5,
      title: "The Rise of Fintech in East Africa",
      excerpt: "How digital financial services are revolutionizing banking and payments",
      category: "Fintech",
      date: "Oct 16, 2025",
      author: "Amara Obi",
      image: "/fintech-mobile-money.png",
    },
    {
      id: 6,
      title: "Cloud Computing Adoption Trends in 2025",
      excerpt: "African enterprises increasingly migrate to cloud infrastructure for scalability",
      category: "Cloud",
      date: "Oct 15, 2025",
      author: "David Kipchoge",
      image: "/cloud-computing-datacenter.png",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/news/${article.id}`}
          className="group flex flex-col h-full bg-card rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all overflow-hidden"
        >
          <div className="relative h-48 overflow-hidden bg-muted">
            <img
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 p-4 flex flex-col">
            <span className="inline-block w-fit px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded mb-3">
              {article.category}
            </span>
            <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">{article.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
              <div className="flex items-center gap-1">
                <User size={14} />
                {article.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {article.date}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
