// Fallback data for when database is not connected
export const fallbackArticles = [
  {
    id: "1",
    title: "African Tech Startups Raise Record $2.5B in 2024",
    excerpt: "Investment in African tech ecosystem reaches all-time high, signaling strong growth potential",
    category: "Startup News",
    published: true,
    views: 1240,
    created_at: "2024-10-20T00:00:00Z",
    authors: { name: "Sarah Okonkwo" }
  },
  {
    id: "2", 
    title: "5G Rollout Accelerates Across Major African Cities",
    excerpt: "Telecommunications companies announce aggressive expansion plans for next-generation connectivity",
    category: "Infrastructure",
    published: true,
    views: 892,
    created_at: "2024-10-18T00:00:00Z",
    authors: { name: "James Mwangi" }
  },
  {
    id: "3",
    title: "AI Integration in African Healthcare: Opportunities and Challenges", 
    excerpt: "Exploring how artificial intelligence is transforming medical services across the continent",
    category: "AI & Tech",
    published: true,
    views: 756,
    created_at: "2024-10-19T00:00:00Z",
    authors: { name: "Amara Obi" }
  }
]

export const fallbackCategories = [
  { id: "1", name: "Startup News", slug: "startup-news" },
  { id: "2", name: "Infrastructure", slug: "infrastructure" },
  { id: "3", name: "AI & Tech", slug: "ai-tech" },
  { id: "4", name: "Security", slug: "security" },
  { id: "5", name: "Fintech", slug: "fintech" },
  { id: "6", name: "Cloud", slug: "cloud" }
]
