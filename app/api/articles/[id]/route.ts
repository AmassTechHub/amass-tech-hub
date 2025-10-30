import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// ✅ Next.js 16 requires params to be awaited (Promise-based)

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select(`
        *,
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
      `)
      .or(`id.eq.${id},slug.eq.${id}`)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ article: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

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

    let updateData: any = { ...body }

    // Compute reading time if content present
    if (content) {
      const wordCount = content.split(/\s+/).length
      updateData.reading_time = Math.max(1, Math.ceil(wordCount / 200))
    }

    if (status === 'published') {
      updateData.published_at = new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
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
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ article: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const { error } = await supabaseAdmin.from('articles').delete().eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
