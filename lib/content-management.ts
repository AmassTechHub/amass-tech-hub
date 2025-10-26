// Comprehensive content management system for all content types
import { supabase } from './supabase'

// Content type interfaces
export interface Tutorial {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number // in minutes
  featured_image?: string
  author: {
    id: string
    name: string
    email: string
    avatar_url?: string
  }
  category: {
    id: string
    name: string
    slug: string
    color: string
  }
  tags: string[]
  published: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface Tool {
  id: string
  name: string
  slug: string
  description: string
  long_description: string
  category: string
  pricing: 'free' | 'freemium' | 'paid'
  website_url: string
  logo_url?: string
  features: string[]
  pros: string[]
  cons: string[]
  rating: number
  review_count: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  event_type: 'conference' | 'webinar' | 'meetup' | 'workshop'
  date: string
  location: string
  country: string
  image_url?: string
  registration_url?: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  title: string
  slug: string
  company: string
  location: string
  country: string
  job_type: 'full-time' | 'part-time' | 'contract' | 'remote'
  description: string
  requirements: string[]
  salary_range?: string
  apply_url: string
  featured: boolean
  expires_at: string
  created_at: string
  updated_at: string
}

// Tutorial functions
export async function getTutorials(limit?: number, level?: string, category?: string): Promise<Tutorial[]> {
  try {
    let query = supabase
      .from('tutorials')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (level) {
      query = query.eq('level', level)
    }

    if (category) {
      query = query.eq('category.slug', category)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching tutorials:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getTutorials:', error)
    return []
  }
}

export async function getTutorial(slug: string): Promise<Tutorial | null> {
  try {
    const { data, error } = await supabase
      .from('tutorials')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) {
      console.error('Error fetching tutorial:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getTutorial:', error)
    return null
  }
}

// Tool functions
export async function getTools(limit?: number, category?: string, pricing?: string): Promise<Tool[]> {
  try {
    let query = supabase
      .from('tools')
      .select('*')
      .order('rating', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (pricing) {
      query = query.eq('pricing', pricing)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching tools:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getTools:', error)
    return []
  }
}

export async function getTool(slug: string): Promise<Tool | null> {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching tool:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getTool:', error)
    return null
  }
}

// Event functions
export async function getEvents(limit?: number, eventType?: string): Promise<Event[]> {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })

    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching events:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getEvents:', error)
    return []
  }
}

export async function getEvent(slug: string): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching event:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getEvent:', error)
    return null
  }
}

// Job functions
export async function getJobs(limit?: number, jobType?: string, location?: string): Promise<Job[]> {
  try {
    let query = supabase
      .from('jobs')
      .select('*')
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (jobType) {
      query = query.eq('job_type', jobType)
    }

    if (location) {
      query = query.ilike('location', `%${location}%`)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching jobs:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getJobs:', error)
    return []
  }
}

export async function getJob(slug: string): Promise<Job | null> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching job:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getJob:', error)
    return null
  }
}

// Search functions
export async function searchTutorials(query: string): Promise<Tutorial[]> {
  try {
    const { data, error } = await supabase
      .from('tutorials')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching tutorials:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in searchTutorials:', error)
    return []
  }
}

export async function searchTools(query: string): Promise<Tool[]> {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,long_description.ilike.%${query}%`)
      .order('rating', { ascending: false })

    if (error) {
      console.error('Error searching tools:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in searchTools:', error)
    return []
  }
}

// Increment view functions
export async function incrementTutorialViews(tutorialId: string): Promise<void> {
  try {
    await supabase.rpc('increment_tutorial_views', { tutorial_id: tutorialId })
  } catch (error) {
    console.error('Error incrementing tutorial views:', error)
  }
}

export async function incrementToolViews(toolId: string): Promise<void> {
  try {
    await supabase.rpc('increment_tool_views', { tool_id: toolId })
  } catch (error) {
    console.error('Error incrementing tool views:', error)
  }
}
