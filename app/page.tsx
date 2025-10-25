import Link from "next/link"
import { ArrowRight, Zap, BookOpen, Wrench, Award } from "lucide-react"
import FeaturedNews from "@/components/home/featured-news"
import NewsGrid from "@/components/home/news-grid"
import NewsletterSignup from "@/components/home/newsletter-signup"
import LatestNewsTicker from "@/components/home/latest-news-ticker"
import MostReadSection from "@/components/home/most-read-section"
import TrendingSection from "@/components/home/trending-section"
import RecommendedSection from "@/components/home/recommended-section"

export default function Home() {
  return (
    <div className="min-h-screen">
      <LatestNewsTicker />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/80 dark:from-purple-900 dark:via-purple-800 dark:to-purple-900/80 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Africa's Premier Tech News & Digital Solutions Hub
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 text-balance">
              Stay ahead with breaking tech news, in-depth reviews, practical tutorials, and expert digital solutions
              tailored for African innovators and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/news"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Explore News <ArrowRight size={20} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MostReadSection />

      {/* Featured News */}
      <section className="py-16 md:py-24 bg-background dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-4">Featured Stories</h2>
            <p className="text-muted-foreground dark:text-gray-400 text-lg">
              The latest and most impactful tech news from across Africa
            </p>
          </div>
          <FeaturedNews />
        </div>
      </section>

      {/* Content Categories */}
      <section className="py-16 md:py-24 bg-card dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-12">Explore Our Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "News",
                description: "Breaking tech news and industry updates",
                href: "/news",
              },
              {
                icon: Award,
                title: "Reviews",
                description: "In-depth product and service reviews",
                href: "/reviews",
              },
              {
                icon: BookOpen,
                title: "Tutorials",
                description: "Learn with practical guides and tips",
                href: "/tutorials",
              },
              {
                icon: Wrench,
                title: "Tools",
                description: "Curated tech tools and resources",
                href: "/tools",
              },
            ].map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.href}
                  href={category.href}
                  className="group p-6 bg-background dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700 hover:border-primary dark:hover:border-accent hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 dark:group-hover:bg-purple-900/50 transition-colors">
                    <Icon className="text-primary dark:text-accent" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">{category.title}</h3>
                  <p className="text-muted-foreground dark:text-gray-400 text-sm mb-4">{category.description}</p>
                  <div className="flex items-center gap-2 text-primary dark:text-accent font-medium text-sm group-hover:gap-3 transition-all">
                    Explore <ArrowRight size={16} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <TrendingSection />

      {/* Latest News Grid */}
      <section className="py-16 md:py-24 bg-background dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-2">Latest News</h2>
              <p className="text-muted-foreground dark:text-gray-400">Stay updated with the newest tech developments</p>
            </div>
            <Link
              href="/news"
              className="text-primary dark:text-accent font-semibold hover:text-primary/80 dark:hover:text-accent/80 transition-colors hidden md:block"
            >
              View All →
            </Link>
          </div>
          <NewsGrid />
        </div>
      </section>

      <RecommendedSection />

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-primary dark:bg-purple-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Connected</h2>
          <p className="text-lg text-white/90 mb-8">
            Get the latest tech news, insights, and exclusive content delivered to your inbox weekly.
          </p>
          <NewsletterSignup />
        </div>
      </section>
    </div>
  )
}
