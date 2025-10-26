import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { fallbackCategories } from '@/lib/fallback-data'

// GET all categories
export async function GET() {
  try {
    // Check if database is available
    const hasDatabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!hasDatabase) {
      // Return fallback data when database is not configured
      return NextResponse.json({ categories: fallbackCategories })
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      // Fallback to static data if database error
      return NextResponse.json({ categories: fallbackCategories })
    }

    return NextResponse.json({ categories: data })
  } catch (error) {
    // Fallback to static data if any error
    return NextResponse.json({ categories: fallbackCategories })
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, color } = body

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({
        name,
        slug,
        description,
        color: color || '#3C0A6B'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ category: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
