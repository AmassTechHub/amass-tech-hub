import Link from "next/link"
import {
  ArrowRight,
  Code,
  Smartphone,
  Cloud,
  Lock,
  BarChart3,
  Zap,
  Users,
  Palette,
  Database,
  Cpu,
  Megaphone,
  Briefcase,
  Headphones,
} from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      icon: Code,
      title: "Web Development",
      description: "Custom web applications built with modern technologies and best practices",
      href: "/services/web-development",
    },
    {
      id: 2,
      icon: Smartphone,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android",
      href: "/services/mobile-development",
    },
    {
      id: 3,
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Cloud infrastructure, migration, and optimization services",
      href: "/services/cloud-solutions",
    },
    {
      id: 4,
      icon: Lock,
      title: "Cybersecurity",
      description: "Security audits, penetration testing, and compliance solutions",
      href: "/services/cybersecurity",
    },
    {
      id: 5,
      icon: BarChart3,
      title: "Data Analytics",
      description: "Business intelligence and data-driven insights for decision making",
      href: "/services/data-analytics",
    },
    {
      id: 6,
      icon: Zap,
      title: "AI & Machine Learning",
      description: "Custom AI solutions and machine learning model development",
      href: "/services/ai-machine-learning",
    },
    {
      id: 7,
      icon: Users,
      title: "Digital Transformation",
      description: "End-to-end digital transformation consulting and implementation",
      href: "/services/digital-transformation",
    },
    {
      id: 8,
      icon: Palette,
      title: "UI/UX Design",
      description: "User-centered design and interface design for digital products",
      href: "/services/ui-ux-design",
    },
    {
      id: 9,
      icon: Database,
      title: "Database Solutions",
      description: "Database design, optimization, and management services",
      href: "/services/database-solutions",
    },
    {
      id: 10,
      icon: Cpu,
      title: "DevOps & Infrastructure",
      description: "CI/CD pipelines, infrastructure automation, and deployment solutions",
      href: "/services/devops-infrastructure",
    },
    {
      id: 11,
      icon: Megaphone,
      title: "Digital Marketing",
      description: "SEO, content marketing, and digital advertising strategies",
      href: "/services/digital-marketing",
    },
    {
      id: 12,
      icon: Briefcase,
      title: "Business Consulting",
      description: "Technology strategy and business process optimization",
      href: "/services/business-consulting",
    },
    {
      id: 13,
      icon: Headphones,
      title: "Technical Support",
      description: "24/7 technical support and managed IT services",
      href: "/services/technical-support",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-white/90">Comprehensive digital solutions tailored to your business needs</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link
                  key={service.id}
                  href={service.href}
                  className="group p-6 bg-card rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                    Learn More <ArrowRight size={16} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-lg text-white/90 mb-8">
            Let's discuss how our services can help you achieve your digital goals.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
