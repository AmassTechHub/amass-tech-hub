import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { fallbackArticles } from '@/lib/fallback-data'

// GET all articles
export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    const hasDatabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!hasDatabase) {
      // Return fallback data when database is not configured
      return NextResponse.json({ articles: fallbackArticles })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const published = searchParams.get('published')

    let query = supabaseAdmin
      .from('articles')
      .select(`
        *,
        authors (
          id,
          name,
          email,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (published !== null) {
      query = query.eq('published', published === 'true')
    }

    const { data, error } = await query
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      // Fallback to static data if database error
      return NextResponse.json({ articles: fallbackArticles })
    }

    return NextResponse.json({ articles: data })
  } catch (error) {
    // Fallback to static data if any error
    return NextResponse.json({ articles: fallbackArticles })
  }
}

// POST create new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, category, author_id, image_url, tags, featured, published } = body

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert({
        title,
        slug,
        content,
        excerpt,
        category,
        author_id,
        image_url,
        tags: tags || [],
        featured: featured || false,
        published: published || false
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ article: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
