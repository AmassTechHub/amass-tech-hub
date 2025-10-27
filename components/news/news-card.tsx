import Link from "next/link"
import { Calendar, User, Eye } from "lucide-react"
import type { RealArticle } from "@/lib/real-content"

interface NewsCardProps {
  article: RealArticle
}

export default function NewsCard({ article }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex flex-col h-full bg-card rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={article.featured_image || "/placeholder.svg"}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {article.featured && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <span 
          className="inline-block w-fit px-2 py-1 text-xs font-semibold rounded mb-3"
          style={{ 
            backgroundColor: (article.categories && article.categories.length > 0 && article.categories[0]?.color) ? `${article.categories[0].color}20` : '#3c0a6b20', 
            color: (article.categories && article.categories.length > 0 && article.categories[0]?.color) || '#3c0a6b'
          }}
        >
          {(article.categories && article.categories.length > 0 && article.categories[0]?.name) || 'Uncategorized'}
        </span>
        <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">{article.excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
          <div className="flex items-center gap-1">
            <User size={14} />
            {article.authors?.name || 'Anonymous'}
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {formatDate(article.published_at || article.created_at)}
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Eye size={14} />
            {article.views}
          </div>
        </div>
      </div>
    </Link>
  )
}
