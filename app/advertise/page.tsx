import Link from "next/link"
import { ArrowRight, BarChart3, Users, Zap, Target } from "lucide-react"

export default function AdvertisePage() {
  const packages = [
    {
      name: "Starter",
      price: "$500",
      period: "/month",
      description: "Perfect for small businesses",
      features: ["Banner ads on homepage", "2 featured placements", "Monthly reporting", "Email support"],
    },
    {
      name: "Professional",
      price: "$1,500",
      period: "/month",
      description: "Ideal for growing companies",
      features: [
        "Premium banner placements",
        "5 featured article placements",
        "Weekly reporting",
        "Priority support",
        "Social media promotion",
      ],
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large-scale campaigns",
      features: [
        "Custom ad placements",
        "Unlimited featured content",
        "Real-time analytics",
        "Dedicated account manager",
        "Multi-channel promotion",
        "Custom integrations",
      ],
    },
  ]

  const benefits = [
    {
      icon: Users,
      title: "5M+ Monthly Readers",
      description: "Reach millions of tech-savvy professionals and enthusiasts across Africa",
    },
    {
      icon: Target,
      title: "Targeted Audience",
      description: "Connect with decision-makers and tech professionals in your industry",
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Track impressions, clicks, and conversions with comprehensive reporting",
    },
    {
      icon: Zap,
      title: "High Engagement",
      description: "Our audience is highly engaged with average session duration of 8+ minutes",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Advertise With Us</h1>
          <p className="text-lg text-white/90">
            Reach millions of tech professionals and decision-makers across Africa
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why Advertise With Amass Tech Hub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="p-6 bg-card rounded-lg border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-card py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Advertising Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`rounded-lg border p-8 flex flex-col ${
                  pkg.featured
                    ? "bg-primary text-white border-primary shadow-lg scale-105"
                    : "bg-background border-border"
                }`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${pkg.featured ? "text-white" : "text-foreground"}`}>
                  {pkg.name}
                </h3>
                <p className={`text-sm mb-4 ${pkg.featured ? "text-white/80" : "text-muted-foreground"}`}>
                  {pkg.description}
                </p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${pkg.featured ? "text-white" : "text-foreground"}`}>
                    {pkg.price}
                  </span>
                  <span className={`text-sm ${pkg.featured ? "text-white/80" : "text-muted-foreground"}`}>
                    {pkg.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((feature, i) => (
                    <li
                      key={i}
                      className={`text-sm flex items-start gap-2 ${
                        pkg.featured ? "text-white/90" : "text-muted-foreground"
                      }`}
                    >
                      <span className={`mt-1 ${pkg.featured ? "text-accent" : "text-primary"}`}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`px-6 py-3 rounded-lg font-semibold text-center transition-opacity hover:opacity-90 ${
                    pkg.featured ? "bg-accent text-accent-foreground" : "bg-primary text-white"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Formats */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Available Ad Formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Banner Ads",
                description: "Eye-catching banner placements on homepage and article pages",
                sizes: "728x90, 300x250, 970x250",
              },
              {
                title: "Sponsored Content",
                description: "Native advertising that blends seamlessly with our editorial content",
                sizes: "Custom formats",
              },
              {
                title: "Newsletter Ads",
                description: "Reach engaged subscribers in our weekly tech newsletter",
                sizes: "Email-optimized",
              },
              {
                title: "Video Ads",
                description: "Pre-roll and mid-roll video advertising on our video content",
                sizes: "16:9, 9:16",
              },
            ].map((format, index) => (
              <div key={index} className="p-6 bg-card rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">{format.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{format.description}</p>
                <p className="text-xs text-muted-foreground">Sizes: {format.sizes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Reach Your Audience?</h2>
          <p className="text-lg text-white/90 mb-8">
            Contact our advertising team to discuss your campaign and get started today.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Contact Sales <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
