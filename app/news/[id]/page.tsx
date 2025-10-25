import Link from "next/link"
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react"
import RelatedArticles from "@/components/news/related-articles"

// Mock data - in production, this would come from a database
const newsArticles: Record<
  string,
  {
    id: number
    title: string
    excerpt: string
    category: string
    date: string
    author: string
    image: string
    content: string
    fullContent: string
  }
> = {
  "1": {
    id: 1,
    title: "African Tech Startups Raise Record $2.5B in 2024",
    excerpt: "Investment in African tech ecosystem reaches all-time high, signaling strong growth potential",
    category: "Startup News",
    date: "Oct 20, 2025",
    author: "Sarah Okonkwo",
    image: "/african-tech-startup-funding.jpg",
    content:
      "The African tech startup ecosystem has reached a significant milestone with total investments hitting $2.5 billion in 2024.",
    fullContent: `The African tech startup ecosystem has reached a significant milestone with total investments hitting $2.5 billion in 2024. This represents a 40% increase from the previous year, demonstrating growing confidence from global and local investors in African innovation.

Key highlights from the investment report:
- Nigeria leads with $800M in funding
- Kenya follows with $600M in venture capital
- South Africa attracts $500M in tech investments
- Emerging markets like Rwanda and Ghana see 50% growth

The surge in funding is driven by several factors:
1. Increased adoption of digital solutions across sectors
2. Growing consumer base with smartphone penetration
3. Government support for tech innovation
4. Success stories attracting international investors

Major investment areas include fintech, e-commerce, healthtech, and agritech. These sectors are addressing critical challenges while creating significant economic opportunities.

Looking ahead, experts predict continued growth as African startups scale globally and attract more institutional investors. The ecosystem is maturing with better support systems, mentorship programs, and access to capital.`,
  },
  "2": {
    id: 2,
    title: "5G Rollout Accelerates Across Major African Cities",
    excerpt: "Telecommunications companies announce aggressive expansion plans for next-generation connectivity",
    category: "Infrastructure",
    date: "Oct 18, 2025",
    author: "James Mwangi",
    image: "/5g-network-infrastructure.jpg",
    content: "Major telecommunications providers across Africa are accelerating their 5G network deployments.",
    fullContent: `Major telecommunications providers across Africa are accelerating their 5G network deployments. By the end of 2025, over 50 major cities are expected to have 5G coverage, transforming mobile connectivity and enabling new applications.

5G Deployment Timeline:
- Q4 2025: 50 cities with 5G coverage
- Q2 2026: 100+ cities connected
- 2027: Nationwide coverage in major markets

Expected Benefits:
- Faster internet speeds (up to 100x faster than 4G)
- Lower latency for real-time applications
- Support for IoT and smart city initiatives
- Enhanced mobile gaming and streaming

Investment Commitments:
Major telecom operators have committed over $5 billion to 5G infrastructure development across the continent. This includes fiber optic networks, base stations, and spectrum acquisition.

Challenges and Solutions:
While deployment faces challenges including infrastructure costs and regulatory hurdles, partnerships between government and private sector are accelerating progress. Public-private partnerships are proving effective in sharing infrastructure costs.

The 5G rollout is expected to unlock new economic opportunities in healthcare, education, agriculture, and manufacturing sectors.`,
  },
  "3": {
    id: 3,
    title: "AI Integration in African Healthcare: Opportunities and Challenges",
    excerpt: "Exploring how artificial intelligence is transforming medical services across the continent",
    category: "AI & Tech",
    date: "Oct 19, 2025",
    author: "Amara Obi",
    image: "/ai-healthcare-africa.jpg",
    content:
      "Artificial intelligence is revolutionizing healthcare delivery in Africa. From diagnostic imaging to drug discovery, AI applications are improving patient outcomes while addressing the continent's healthcare challenges.",
    fullContent: `Artificial intelligence is revolutionizing healthcare delivery in Africa. From diagnostic imaging to drug discovery, AI applications are improving patient outcomes while addressing the continent's healthcare challenges.

AI Applications in African Healthcare:

1. Diagnostic Imaging
- AI-powered radiology analysis
- Early disease detection
- Reduced diagnostic errors

2. Drug Discovery
- Accelerated research timelines
- Cost reduction in development
- Personalized medicine approaches

3. Patient Management
- Predictive analytics for patient outcomes
- Automated appointment scheduling
- Remote patient monitoring

Success Stories:
Several African healthcare institutions have successfully implemented AI solutions:
- Diagnostic accuracy improved by 30%
- Patient wait times reduced by 40%
- Healthcare costs decreased by 25%

Challenges to Address:
- Data privacy and security concerns
- Limited AI expertise in healthcare sector
- Infrastructure requirements
- Regulatory frameworks

The Future of AI in African Healthcare:
As AI technology matures and becomes more accessible, we expect widespread adoption across public and private healthcare systems. This will significantly improve healthcare delivery and outcomes across the continent.`,
  },
  "4": {
    id: 4,
    title: "Cybersecurity Best Practices for African Businesses",
    excerpt: "Essential security measures every organization should implement in 2025",
    category: "Security",
    date: "Oct 17, 2025",
    author: "David Kipchoge",
    image: "/cybersecurity-business.jpg",
    content:
      "As cyber threats evolve, African businesses must adopt comprehensive security strategies. This includes employee training, regular security audits, and implementation of zero-trust architecture.",
    fullContent: `As cyber threats evolve, African businesses must adopt comprehensive security strategies. This includes employee training, regular security audits, and implementation of zero-trust architecture.

Essential Cybersecurity Measures:

1. Employee Training
- Regular security awareness programs
- Phishing simulation exercises
- Best practices documentation

2. Technical Controls
- Multi-factor authentication
- Encryption of sensitive data
- Regular security updates

3. Organizational Policies
- Incident response plans
- Data backup procedures
- Access control policies

Zero-Trust Architecture:
This security model assumes no user or device is trustworthy by default. Every access request is verified, regardless of source.

Benefits:
- Reduced breach impact
- Better visibility into network activity
- Improved compliance posture

Implementation Steps:
1. Assess current security posture
2. Identify critical assets
3. Implement identity verification
4. Deploy monitoring systems
5. Establish incident response procedures

Cost-Benefit Analysis:
While implementing cybersecurity measures requires investment, the cost of a data breach far exceeds prevention costs. Organizations should view cybersecurity as a business enabler, not just a cost center.`,
  },
  "5": {
    id: 5,
    title: "The Rise of Fintech in East Africa",
    excerpt: "How digital financial services are revolutionizing banking and payments",
    category: "Fintech",
    date: "Oct 16, 2025",
    author: "Sarah Okonkwo",
    image: "/fintech-mobile-money.png",
    content:
      "East Africa continues to lead the continent in fintech innovation. Mobile money services, digital lending platforms, and blockchain-based solutions are providing financial inclusion to millions.",
    fullContent: `East Africa continues to lead the continent in fintech innovation. Mobile money services, digital lending platforms, and blockchain-based solutions are providing financial inclusion to millions.

Fintech Innovations in East Africa:

1. Mobile Money
- M-Pesa and similar services
- Over 100 million active users
- Transaction volumes exceeding $100B annually

2. Digital Lending
- Peer-to-peer lending platforms
- Algorithmic credit scoring
- Microfinance digitalization

3. Blockchain Solutions
- Cryptocurrency adoption
- Smart contracts for business
- Decentralized finance (DeFi)

Market Growth:
The East African fintech market is projected to grow at 25% CAGR through 2030. This growth is driven by:
- Increasing smartphone penetration
- Growing digital literacy
- Government support for financial inclusion
- International investment

Key Players:
- Established fintech companies expanding services
- New startups entering the market
- Traditional banks digitizing operations
- International fintech firms establishing presence

Impact on Financial Inclusion:
Fintech solutions have brought banking services to previously unbanked populations. Over 50 million people in East Africa now have access to digital financial services.

Future Outlook:
Continued innovation in fintech will drive economic growth, job creation, and improved living standards across the region.`,
  },
  "6": {
    id: 6,
    title: "Cloud Computing Adoption Trends in 2025",
    excerpt: "African enterprises increasingly migrate to cloud infrastructure for scalability",
    category: "Cloud",
    date: "Oct 15, 2025",
    author: "James Mwangi",
    image: "/cloud-computing-datacenter.png",
    content:
      "Cloud adoption among African enterprises is accelerating, with companies recognizing the benefits of scalability, cost efficiency, and global accessibility. Major cloud providers are expanding their African data centers.",
    fullContent: `Cloud adoption among African enterprises is accelerating, with companies recognizing the benefits of scalability, cost efficiency, and global accessibility. Major cloud providers are expanding their African data centers.

Cloud Adoption Statistics:
- 65% of African enterprises use cloud services
- 40% plan to increase cloud spending
- Average cloud spending growth: 30% annually

Benefits Driving Adoption:

1. Cost Efficiency
- Reduced capital expenditure
- Pay-as-you-go pricing models
- Elimination of on-premise maintenance

2. Scalability
- Easy resource expansion
- Support for business growth
- Flexibility for seasonal demands

3. Global Accessibility
- Remote work enablement
- International collaboration
- 24/7 availability

Cloud Services in Use:
- Infrastructure as a Service (IaaS): 45%
- Platform as a Service (PaaS): 30%
- Software as a Service (SaaS): 25%

Regional Data Centers:
Major cloud providers have established data centers in:
- South Africa
- Nigeria
- Kenya
- Egypt

Challenges and Solutions:
- Data sovereignty concerns → Local data center options
- Security concerns → Enhanced compliance certifications
- Connectivity issues → Improved infrastructure investment

Future Trends:
- Edge computing adoption
- Hybrid cloud solutions
- AI-powered cloud services
- Increased focus on sustainability

The cloud computing market in Africa is expected to reach $10 billion by 2030, representing significant growth opportunities for businesses and service providers.`,
  },
}

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const article = newsArticles[params.id]

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Article Not Found</h1>
          <Link href="/news" className="text-primary hover:text-primary/80 font-semibold">
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/news" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowLeft size={20} />
            Back to News
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{article.title}</h1>
          <div className="flex flex-wrap gap-4 text-white/90">
            <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
              {article.category}
            </span>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              {article.date}
            </div>
            <div className="flex items-center gap-2">
              <User size={18} />
              {article.author}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <img
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg text-muted-foreground mb-6">{article.excerpt}</p>
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">{article.fullContent}</div>
          </div>

          {/* Share */}
          <div className="flex items-center gap-4 py-8 border-t border-border">
            <span className="text-muted-foreground font-semibold">Share:</span>
            <button className="p-2 hover:bg-card rounded-lg transition-colors">
              <Share2 size={20} className="text-primary" />
            </button>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Related Articles</h2>
          <RelatedArticles currentId={article.id} />
        </div>
      </section>
    </div>
  )
}
