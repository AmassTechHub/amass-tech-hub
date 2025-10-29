import { notFound } from "next/navigation"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { supabaseAdmin } from "@/lib/supabase"

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image?: string
  created_at: string
  published_at?: string
  reading_time?: number
  authors?: { name: string; avatar_url?: string } | null
  categories?: { name: string; slug: string; color?: string } | null
}

// ✅ Fetch the article by slug
export async function getArticle(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content,
      featured_image,
      created_at,
      published_at,
      reading_time,
      authors:author_id ( name, avatar_url ),
      categories:category_id ( name, slug, color )
      `
    )
    .eq("slug", slug)
    .maybeSingle()

  if (error || !data) return null
  return data as Article
}

// ✅ Generate static params (optional if using SSG)
export async function generateStaticParams() {
  const { data } = await supabaseAdmin.from("articles").select("slug").eq("status", "published")
  return (data || []).map((a) => ({ slug: a.slug }))
}

// ✅ Main article page
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)
  if (!article) return notFound()

  return (
    <article className="max-w-4xl mx-auto py-10 px-4">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-foreground">
        {article.title}
      </h1>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
        {article.authors?.name && (
          <span className="flex items-center gap-2">
            {article.authors.avatar_url && (
              <Image
                src={article.authors.avatar_url}
                alt={article.authors.name}
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            )}
            <span>{article.authors.name}</span>
          </span>
        )}
        {article.categories?.name && (
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
            {article.categories.name}
          </span>
        )}
        {article.published_at && (
          <time>
            {new Date(article.published_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        )}
        {article.reading_time && <span>• {article.reading_time} min read</span>}
      </div>

      {/* Featured image */}
      {article.featured_image && (
        <div className="relative w-full h-[400px] md:h-[500px] mb-8 overflow-hidden rounded-2xl shadow-sm">
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content || "_No content available._"}
        </ReactMarkdown>
      </div>
    </article>
  )
}
