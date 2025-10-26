import Link from "next/link"
import { ArrowLeft, Calendar, User, Share2, Eye } from "lucide-react"
import RelatedArticles from "@/components/news/related-articles"
import { getRealArticle, incrementArticleViews } from "@/lib/real-content"
import { notFound } from "next/navigation"

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const article = await getRealArticle(params.id)

  if (!article) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/news" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowLeft size={20} />
            Back to News
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{article.title}</h1>
          <div className="flex flex-wrap gap-4 text-white/90">
            <span 
              className="px-3 py-1 text-sm font-semibold rounded-full"
              style={{ 
                backgroundColor: `${article.category.color}20`, 
                color: article.category.color 
              }}
            >
              {article.category.name}
            </span>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              {formatDate(article.published_at || article.created_at)}
            </div>
            <div className="flex items-center gap-2">
              <User size={18} />
              {article.author.name}
            </div>
            <div className="flex items-center gap-2">
              <Eye size={18} />
              {article.views} views
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <img
            src={article.featured_image || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg text-muted-foreground mb-6">{article.excerpt}</p>
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">{article.content}</div>
          </div>

          {/* Share */}
          <div className="flex items-center gap-4 py-8 border-t border-border">
            <span className="text-muted-foreground font-semibold">Share:</span>
            <button className="p-2 hover:bg-card rounded-lg transition-colors">
              <Share2 size={20} className="text-primary" />
            </button>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Related Articles</h2>
          <RelatedArticles currentId={article.id} />
        </div>
      </section>
    </div>
  )
}
