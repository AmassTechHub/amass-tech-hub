import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET all authors
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('authors')
      .select('*')
      .order('name')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 })
    }

    return NextResponse.json({ authors: data || [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST create new author
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, bio, avatar_url, social_links } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, email' 
      }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('authors')
      .insert({
        name,
        email,
        bio: bio || null,
        avatar_url: avatar_url || null,
        social_links: social_links || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ author: data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
