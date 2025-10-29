// Base content type that all other types will extend
export interface BaseContent {
  id: string
  title: string
  slug: string
  description: string
  featuredImage?: string
  createdAt: string
  updatedAt: string
  published: boolean
  authorId: string
}

// Tutorial content type
export interface Tutorial extends BaseContent {
  content: string
  category: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedReadTime: number // in minutes
  prerequisites?: string[]
}

// Tool content type
export interface Tool extends BaseContent {
  website: string
  category: string
  tags: string[]
  pricing: 'free' | 'freemium' | 'paid' | 'open-source'
  features: string[]
  pros: string[]
  cons: string[]
  rating: number // 1-5
}

// Service content type
export interface Service extends BaseContent {
  category: string
  tags: string[]
  pricing: string
  features: string[]
  duration?: string
  deliverables: string[]
  faqs?: Array<{ question: string; answer: string }>
}

// Podcast content type
export interface Podcast extends BaseContent {
  audioUrl: string
  duration: number // in seconds
  transcript?: string
  showNotes?: string
  guests?: Array<{
    name: string
    role: string
    company?: string
    twitter?: string
  }>
  category: string
  tags: string[]
}

// Event content type
export interface Event extends BaseContent {
  startDate: string
  endDate: string
  location: string
  isOnline: boolean
  registrationUrl?: string
  price: number
  capacity?: number
  category: string
  tags: string[]
  schedule?: Array<{
    time: string
    title: string
    speaker?: string
    description?: string
  }>
}

// Job content type
export interface Job extends BaseContent {
  company: string
  location: string
  isRemote: boolean
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship'
  salaryRange?: {
    min: number
    max: number
    currency: string
    period: 'year' | 'month' | 'week' | 'hour'
  }
  applicationUrl: string
  requirements: string[]
  responsibilities: string[]
  benefits?: string[]
  category: string
  tags: string[]
  deadline?: string
}

// Union type for all content types
export type ContentType = Tutorial | Tool | Service | Podcast | Event | Job

// Type guard functions
export function isTutorial(content: BaseContent): content is Tutorial {
  return 'difficulty' in content
}

export function isTool(content: BaseContent): content is Tool {
  return 'website' in content && 'pricing' in content
}

export function isService(content: BaseContent): content is Service {
  return 'deliverables' in content
}

export function isPodcast(content: BaseContent): content is Podcast {
  return 'audioUrl' in content
}

export function isEvent(content: BaseContent): content is Event {
  return 'startDate' in content && 'endDate' in content
}

export function isJob(content: BaseContent): content is Job {
  return 'employmentType' in content && 'company' in content
}
