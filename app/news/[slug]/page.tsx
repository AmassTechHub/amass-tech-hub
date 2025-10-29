import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { supabaseAdmin } from "@/lib/supabase"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string
  created_at: string
  published_at?: string
  reading_time?: number
  authors?: { name: string; avatar_url?: string } | null
  categories?: { id: string; name: string; slug: string; color?: string } | null
}

// ✅ Get one article by slug
async function getArticle(slug: string): Promise<Article | null> {
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
      categories:category_id ( id, name, slug, color )
      `
    )
    .eq("slug", slug)
    .maybeSingle()

  if (error || !data) return null
  return data as Article
}

// ✅ Get related or recent articles
async function getSuggestions(categoryId: string | null, excludeSlug: string) {
  let query = supabaseAdmin
    .from("articles")
    .select("id, title, slug, excerpt, featured_image, published_at")
    .eq("status", "published")
    .neq("slug", excludeSlug)
    .order("published_at", { ascending: false })
    .limit(3)

  if (categoryId) query = query.eq("category_id", categoryId)

  let { data, error } = await query
  if (error || !data || data.length === 0) {
    // fallback → 3 most recent
    const { data: recent } = await supabaseAdmin
      .from("articles")
      .select("id, title, slug, excerpt, featured_image, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3)
    return recent || []
  }

  return data
}

// ✅ Main page
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)
  if (!article) return notFound()

  const related = await getSuggestions(article.categories?.id || null, article.slug)

  return (
    <article className="max-w-4xl mx-auto py-10 px-4">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-foreground">
        {article.title}
      </h1>

      {/* Meta */}
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

      {/* Image */}
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
      <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content || "_No content available._"}
        </ReactMarkdown>
      </div>

      {/* Related or Recent */}
      {related.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            {article.categories?.name ? "Related Articles" : "Recent Articles"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/news/${r.slug}`}
                className="group block rounded-xl overflow-hidden border border-border hover:shadow-md transition"
              >
                {r.featured_image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={r.featured_image}
                      alt={r.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
