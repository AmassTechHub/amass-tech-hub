// Mock CMS Data - In production, this would come from a database

import type { Author, NewsArticle, Testimonial, Partner } from "./types"

export const authors: Author[] = [
  {
    id: "1",
    name: "Sarah Okonkwo",
    email: "sarah@amasstechweb.com",
    bio: "Tech journalist with 10+ years of experience covering African tech ecosystem",
    avatar: "/authors/sarah.jpg",
    role: "editor",
  },
  {
    id: "2",
    name: "James Mwangi",
    email: "james@amasstechweb.com",
    bio: "Software engineer and tech writer specializing in infrastructure and DevOps",
    avatar: "/authors/james.jpg",
    role: "contributor",
  },
  {
    id: "3",
    name: "Amara Obi",
    email: "amara@amasstechweb.com",
    bio: "Content strategist focused on making tech accessible to African audiences",
    avatar: "/authors/amara.jpg",
    role: "contributor",
  },
  {
    id: "4",
    name: "David Kipchoge",
    email: "david@amasstechweb.com",
    bio: "Business consultant and digital transformation expert",
    avatar: "/authors/david.jpg",
    role: "contributor",
  },
]

export const testimonials: Testimonial[] = [
  {
    id: "1",
    author: "Kofi Mensah",
    role: "CEO",
    company: "TechStart Africa",
    content:
      "Amass Tech Hub has been instrumental in keeping us informed about the latest tech trends. Their insights have directly impacted our business strategy.",
    rating: 5,
    image: "/testimonials/kofi.jpg",
  },
  {
    id: "2",
    author: "Zainab Hassan",
    role: "CTO",
    company: "FinTech Solutions",
    content:
      "The quality of content and depth of analysis is unmatched. We rely on Amass for staying ahead of industry developments.",
    rating: 5,
    image: "/testimonials/zainab.jpg",
  },
  {
    id: "3",
    author: "Kwame Asante",
    role: "Product Manager",
    company: "Digital Innovations Ltd",
    content:
      "Their tutorials and guides have helped our team upskill significantly. Highly recommended for anyone in tech.",
    rating: 5,
    image: "/testimonials/kwame.jpg",
  },
]

export const partners: Partner[] = [
  {
    id: "1",
    name: "Google Cloud",
    logo: "/partners/google-cloud.png",
    description: "Cloud infrastructure partner",
    website: "https://cloud.google.com",
    category: "Cloud",
  },
  {
    id: "2",
    name: "AWS",
    logo: "/partners/aws.png",
    description: "Cloud services partner",
    website: "https://aws.amazon.com",
    category: "Cloud",
  },
  {
    id: "3",
    name: "GitHub",
    logo: "/partners/github.png",
    description: "Development platform partner",
    website: "https://github.com",
    category: "Development",
  },
  {
    id: "4",
    name: "Figma",
    logo: "/partners/figma.png",
    description: "Design tools partner",
    website: "https://figma.com",
    category: "Design",
  },
]

// Helper functions for CMS operations
export function getAuthorById(id: string): Author | undefined {
  return authors.find((author) => author.id === id)
}

export function getArticlesByCategory(category: string): NewsArticle[] {
  // This would query the database in production
  return []
}

export function getFeaturedArticles(limit = 3): NewsArticle[] {
  // This would query the database in production
  return []
}

export function getLatestArticles(limit = 10): NewsArticle[] {
  // This would query the database in production
  return []
}

export function searchArticles(query: string): NewsArticle[] {
  // This would query the database in production
  return []
}
