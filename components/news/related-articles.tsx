import NewsCard from "./news-card"

interface RelatedArticlesProps {
  currentId: number
}

export default function RelatedArticles({ currentId }: RelatedArticlesProps) {
  const allArticles = [
    {
      id: 1,
      title: "African Tech Startups Raise Record $2.5B in 2024",
      excerpt: "Investment in African tech ecosystem reaches all-time high",
      category: "Startup News",
      date: "Oct 20, 2025",
      author: "Sarah Okonkwo",
      image: "/african-tech-startup-funding.jpg",
    },
    {
      id: 2,
      title: "5G Rollout Accelerates Across Major African Cities",
      excerpt: "Telecommunications companies announce aggressive expansion plans",
      category: "Infrastructure",
      date: "Oct 18, 2025",
      author: "James Mwangi",
      image: "/5g-network-infrastructure.jpg",
    },
    {
      id: 3,
      title: "AI Integration in African Healthcare: Opportunities and Challenges",
      excerpt: "Exploring how artificial intelligence is transforming medical services",
      category: "AI & Tech",
      date: "Oct 19, 2025",
      author: "Amara Obi",
      image: "/ai-healthcare-africa.jpg",
    },
    {
      id: 4,
      title: "Cybersecurity Best Practices for African Businesses",
      excerpt: "Essential security measures every organization should implement",
      category: "Security",
      date: "Oct 17, 2025",
      author: "David Kipchoge",
      image: "/cybersecurity-business.jpg",
    },
    {
      id: 5,
      title: "The Rise of Fintech in East Africa",
      excerpt: "How digital financial services are revolutionizing banking",
      category: "Fintech",
      date: "Oct 16, 2025",
      author: "Sarah Okonkwo",
      image: "/fintech-mobile-money.png",
    },
    {
      id: 6,
      title: "Cloud Computing Adoption Trends in 2025",
      excerpt: "African enterprises increasingly migrate to cloud infrastructure",
      category: "Cloud",
      date: "Oct 15, 2025",
      author: "James Mwangi",
      image: "/cloud-computing-datacenter.png",
    },
  ]

  const related = allArticles.filter((article) => article.id !== currentId).slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {related.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  )
}
