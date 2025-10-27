// Real content management system - replaces all dummy data
import { supabase } from './supabase'

export interface RealArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string
  categories: {
    id: string
    name: string
    slug: string
    color: string
  }[]
  authors: {
    id: string
    name: string
    email: string
    avatar_url?: string
  }
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  views: number
  reading_time: number
  tags: string[]
  seo_title?: string
  seo_description?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface RealCategory {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  created_at: string
  updated_at: string
}

export interface RealAuthor {
  id: string
  name: string
  email: string
  bio?: string
  avatar_url?: string
  social_links?: Record<string, string>
  created_at: string
  updated_at: string
}

// Fetch real articles from database
export async function getRealArticles(limit?: number, category?: string, featured?: boolean): Promise<RealArticle[]> {
  try {
    let query = supabase
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
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (featured) {
      query = query.eq('featured', true)
    }

    if (category) {
      query = query.eq('category_id', category)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching articles:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getRealArticles:', error)
    return []
  }
}

// Fetch single article by slug or ID
export async function getRealArticle(slugOrId: string): Promise<RealArticle | null> {
  try {
    const { data, error } = await supabase
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
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Error fetching article:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getRealArticle:', error)
    return null
  }
}

// Fetch categories
export async function getRealCategories(): Promise<RealCategory[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getRealCategories:', error)
    return []
  }
}

// Fetch authors
export async function getRealAuthors(): Promise<RealAuthor[]> {
  try {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching authors:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getRealAuthors:', error)
    return []
  }
}

// Search articles
export async function searchRealArticles(query: string): Promise<RealArticle[]> {
  try {
    const { data, error } = await supabase
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
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error searching articles:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in searchRealArticles:', error)
    return []
  }
}

// Increment article views
export async function incrementArticleViews(articleId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('articles')
      .update({ views: supabase.raw('views + 1') })
      .eq('id', articleId)

    if (error) {
      console.error('Error incrementing views:', error)
    }
  } catch (error) {
    console.error('Error in incrementArticleViews:', error)
  }
}