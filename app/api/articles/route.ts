import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { fallbackArticles } from "@/lib/fallback-data"

// ✅ GET all articles (with support for pagination, category, etc.)
export async function GET(request: NextRequest) {
  try {
    const hasDatabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!hasDatabase) {
      return NextResponse.json({ articles: fallbackArticles })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const status = searchParams.get("status") || "published"
    const featured = searchParams.get("featured")

    let query = supabaseAdmin
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        featured_image,
        views,
        status,
        published_at,
        categories (
          id,
          name,
          slug,
          color
        ),
        authors (
          id,
          name,
          email,
          avatar_url
        )
      `
      )
      .order("views", { ascending: false })

    if (category && category !== "all") query = query.eq("category_id", category)
    if (status) query = query.eq("status", status)
    if (featured !== null) query = query.eq("featured", featured === "true")

    const { data, error } = await query.range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("Database error:", error.message)
      return NextResponse.json({ articles: fallbackArticles })
    }

    return NextResponse.json({ articles: data || [] })
  } catch (error: any) {
    console.error("API error:", error.message)
    return NextResponse.json({ articles: fallbackArticles })
  }
}

// ✅ POST - create a new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      category_id,
      author_id,
      featured_image,
      tags,
      featured,
      status,
      seo_title,
      seo_description,
    } = body

    if (!title || !content || !excerpt || !category_id || !author_id) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, excerpt, category_id, author_id" },
        { status: 400 }
      )
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    const articleData = {
      title,
      slug,
      content,
      excerpt,
      category_id,
      author_id,
      featured_image: featured_image || null,
      tags: tags || [],
      featured: featured || false,
      status: status || "draft",
      reading_time: readingTime,
      seo_title: seo_title || title,
      seo_description: seo_description || excerpt,
      published_at: status === "published" ? new Date().toISOString() : null,
      views: 0,
    }

    const { data, error } = await supabaseAdmin
      .from("articles")
      .insert(articleData)
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        featured_image,
        views,
        status,
        published_at,
        categories (
          id,
          name,
          slug,
          color
        ),
        authors (
          id,
          name,
          email,
          avatar_url
        )
      `
      )
      .single()

    if (error) {
      console.error("Database error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ article: data }, { status: 201 })
  } catch (error: any) {
    console.error("API error:", error.message)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
