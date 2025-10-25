// Content Management System Types

export interface Author {
  id: string
  name: string
  email: string
  bio: string
  avatar: string
  role: "editor" | "contributor" | "admin"
}

export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: "Startup News" | "Infrastructure" | "AI & Tech" | "Security" | "Fintech" | "Cloud"
  author: Author
  image: string
  publishedAt: Date
  updatedAt: Date
  featured: boolean
  views: number
  tags: string[]
}

export interface Review {
  id: string
  title: string
  slug: string
  product: string
  category: "Software" | "Hardware" | "SaaS" | "Mobile Apps" | "Cloud Services"
  rating: number
  excerpt: string
  content: string
  author: Author
  image: string
  publishedAt: Date
  pros: string[]
  cons: string[]
  verdict: string
}

export interface Tutorial {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: number // in minutes
  author: Author
  image: string
  publishedAt: Date
  tags: string[]
  resources: { title: string; url: string }[]
}

export interface Tool {
  id: string
  name: string
  slug: string
  category: "Development" | "Design" | "Productivity" | "Analytics" | "Security"
  description: string
  rating: number
  url: string
  image: string
  features: string[]
  pricing: "Free" | "Freemium" | "Paid"
  addedAt: Date
}

export interface Service {
  id: string
  title: string
  slug: string
  description: string
  fullDescription: string
  benefits: string[]
  process: string[]
  technologies: string[]
  icon: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  subscribedAt: Date
  unsubscribedAt?: Date
  preferences: {
    news: boolean
    reviews: boolean
    tutorials: boolean
    tools: boolean
    services: boolean
  }
}

export interface NewsletterIssue {
  id: string
  title: string
  subject: string
  content: string
  featuredArticles: NewsArticle[]
  publishedAt: Date
  recipientCount: number
  openRate: number
  clickRate: number
}

export interface Testimonial {
  id: string
  author: string
  role: string
  company: string
  content: string
  rating: number
  image: string
}

export interface Partner {
  id: string
  name: string
  logo: string
  description: string
  website: string
  category: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar: string
  bio?: string
  createdAt: Date
  preferences: UserPreferences
  stats: UserStats
}

export interface UserPreferences {
  theme: "light" | "dark"
  newsletter: boolean
  emailNotifications: boolean
  followedAuthors: string[]
  savedArticles: string[]
  readingList: string[]
  interests: string[]
}

export interface UserStats {
  articlesRead: number
  articlesShared: number
  commentsPosted: number
  articlesSaved: number
  referralsCount: number
  membershipTier: "free" | "pro" | "enterprise"
  joinedAt: Date
}

export interface Comment {
  id: string
  articleId: string
  userId: string
  author: User
  content: string
  createdAt: Date
  updatedAt: Date
  likes: number
  replies: Comment[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  criteria: string
}

export interface UserBadge {
  userId: string
  badgeId: string
  earnedAt: Date
}

export interface Podcast {
  id: string
  title: string
  slug: string
  description: string
  host: Author
  episodes: PodcastEpisode[]
  image: string
  spotifyUrl?: string
  appleUrl?: string
  createdAt: Date
}

export interface PodcastEpisode {
  id: string
  podcastId: string
  title: string
  description: string
  audioUrl: string
  duration: number
  publishedAt: Date
  transcript?: string
}

export interface TechEvent {
  id: string
  title: string
  slug: string
  description: string
  date: Date
  location: string
  country: string
  eventType: "conference" | "webinar" | "meetup" | "workshop"
  image: string
  registrationUrl?: string
  speakers: Author[]
  createdAt: Date
}

export interface JobListing {
  id: string
  title: string
  slug: string
  company: string
  location: string
  country: string
  jobType: "full-time" | "part-time" | "contract" | "remote"
  description: string
  requirements: string[]
  salary?: string
  applyUrl: string
  postedAt: Date
  expiresAt: Date
}

export interface CaseStudy {
  id: string
  title: string
  slug: string
  company: string
  industry: string
  challenge: string
  solution: string
  results: string[]
  image: string
  author: Author
  publishedAt: Date
}

export interface Roundup {
  id: string
  title: string
  slug: string
  period: "weekly" | "monthly"
  articles: NewsArticle[]
  summary: string
  publishedAt: Date
}

export interface SponsorshipPackage {
  id: string
  name: string
  price: number
  features: string[]
  description: string
}

export interface AffiliateLink {
  id: string
  title: string
  url: string
  category: string
  commission: number
  clicks: number
  conversions: number
}
