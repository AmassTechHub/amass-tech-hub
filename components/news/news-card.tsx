import Link from "next/link"
import { Calendar, User } from "lucide-react"

interface NewsCardProps {
  article: {
    id: number
    title: string
    excerpt: string
    category: string
    date: string
    author: string
    image: string
  }
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Link
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
  )
}
