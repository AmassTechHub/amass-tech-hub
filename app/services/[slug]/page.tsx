import Link from "next/link"
import { ArrowLeft, Check, ArrowRight } from "lucide-react"

const serviceDetails: Record<
  string,
  {
    title: string
    description: string
    fullDescription: string
    benefits: string[]
    process: string[]
    technologies: string[]
  }
> = {
  "web-development": {
    title: "Web Development",
    description: "Custom web applications built with modern technologies and best practices",
    fullDescription:
      "We create responsive, scalable web applications using the latest technologies and frameworks. Our team specializes in building user-friendly interfaces and robust backend systems that drive business growth.",
    benefits: [
      "Responsive design for all devices",
      "Fast loading times and optimal performance",
      "SEO-friendly architecture",
      "Secure and scalable solutions",
      "Easy maintenance and updates",
      "Integration with third-party services",
    ],
    process: [
      "Requirements gathering and analysis",
      "UI/UX design and prototyping",
      "Frontend development",
      "Backend development",
      "Testing and quality assurance",
      "Deployment and launch",
      "Ongoing support and maintenance",
    ],
    technologies: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "AWS", "Docker"],
  },
  "mobile-development": {
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android",
    fullDescription:
      "We develop high-performance mobile applications that provide excellent user experiences. Whether you need native apps or cross-platform solutions, our team delivers quality applications.",
    benefits: [
      "Native performance and user experience",
      "Cross-platform compatibility",
      "Offline functionality",
      "Push notifications",
      "App store optimization",
      "Regular updates and support",
    ],
    process: [
      "App concept and planning",
      "UI/UX design",
      "Native or cross-platform development",
      "API integration",
      "Testing on real devices",
      "App store submission",
      "Post-launch support",
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "REST APIs"],
  },
  "cloud-solutions": {
    title: "Cloud Solutions",
    description: "Cloud infrastructure, migration, and optimization services",
    fullDescription:
      "We help businesses leverage cloud technology for scalability, reliability, and cost efficiency. Our cloud solutions are tailored to your specific business requirements.",
    benefits: [
      "Reduced infrastructure costs",
      "Automatic scaling and load balancing",
      "High availability and disaster recovery",
      "Data backup and security",
      "Global content delivery",
      "Pay-as-you-go pricing",
    ],
    process: [
      "Cloud strategy assessment",
      "Architecture design",
      "Migration planning",
      "Data migration",
      "Testing and validation",
      "Optimization and monitoring",
      "Ongoing management",
    ],
    technologies: ["AWS", "Google Cloud", "Azure", "Kubernetes", "Docker", "Terraform"],
  },
  cybersecurity: {
    title: "Cybersecurity",
    description: "Security audits, penetration testing, and compliance solutions",
    fullDescription:
      "Protect your business from cyber threats with our comprehensive security solutions. We provide assessments, testing, and implementation of security best practices.",
    benefits: [
      "Vulnerability identification",
      "Threat detection and prevention",
      "Compliance with regulations",
      "Employee security training",
      "Incident response planning",
      "Continuous monitoring",
    ],
    process: [
      "Security assessment",
      "Vulnerability scanning",
      "Penetration testing",
      "Risk analysis",
      "Remediation planning",
      "Implementation",
      "Ongoing monitoring",
    ],
    technologies: ["SIEM", "Firewalls", "Encryption", "VPN", "Multi-factor authentication"],
  },
  "data-analytics": {
    title: "Data Analytics",
    description: "Business intelligence and data-driven insights for decision making",
    fullDescription:
      "Transform your data into actionable insights. Our analytics solutions help you understand customer behavior, optimize operations, and drive business growth.",
    benefits: [
      "Data visualization and dashboards",
      "Predictive analytics",
      "Customer insights",
      "Performance metrics",
      "Real-time reporting",
      "Data-driven decision making",
    ],
    process: [
      "Data collection and integration",
      "Data cleaning and preparation",
      "Analysis and modeling",
      "Visualization design",
      "Dashboard development",
      "Training and documentation",
      "Ongoing optimization",
    ],
    technologies: ["Python", "R", "Tableau", "Power BI", "SQL", "Apache Spark"],
  },
  "ai-machine-learning": {
    title: "AI & Machine Learning",
    description: "Custom AI solutions and machine learning model development",
    fullDescription:
      "Leverage artificial intelligence to automate processes and gain competitive advantages. We develop custom AI and ML solutions tailored to your business needs.",
    benefits: [
      "Process automation",
      "Predictive modeling",
      "Natural language processing",
      "Computer vision",
      "Recommendation systems",
      "Improved efficiency",
    ],
    process: [
      "Problem definition",
      "Data collection and preparation",
      "Model development",
      "Training and validation",
      "Testing and evaluation",
      "Deployment",
      "Monitoring and optimization",
    ],
    technologies: ["TensorFlow", "PyTorch", "Scikit-learn", "Python", "OpenAI", "Hugging Face"],
  },
  "digital-transformation": {
    title: "Digital Transformation",
    description: "End-to-end digital transformation consulting and implementation",
    fullDescription:
      "We guide organizations through their digital transformation journey, helping them modernize operations and embrace digital-first strategies.",
    benefits: [
      "Process modernization",
      "Improved efficiency",
      "Better customer experience",
      "Competitive advantage",
      "Cost reduction",
      "Employee productivity",
    ],
    process: [
      "Assessment and strategy",
      "Roadmap development",
      "Technology selection",
      "Change management",
      "Implementation",
      "Training and adoption",
      "Continuous improvement",
    ],
    technologies: ["Cloud platforms", "Automation tools", "Analytics platforms", "Collaboration tools"],
  },
  "ui-ux-design": {
    title: "UI/UX Design",
    description: "User-centered design and interface design for digital products",
    fullDescription:
      "We create beautiful, intuitive interfaces that users love. Our design process focuses on user research, usability, and aesthetic excellence.",
    benefits: [
      "User-centered design",
      "Improved user satisfaction",
      "Higher conversion rates",
      "Brand consistency",
      "Accessibility compliance",
      "Mobile-first approach",
    ],
    process: [
      "User research and personas",
      "Wireframing and prototyping",
      "Visual design",
      "Usability testing",
      "Iteration and refinement",
      "Design system creation",
      "Handoff to development",
    ],
    technologies: ["Figma", "Adobe XD", "Sketch", "Prototyping tools", "User testing platforms"],
  },
  "database-solutions": {
    title: "Database Solutions",
    description: "Database design, optimization, and management services",
    fullDescription:
      "We design and optimize databases for performance, scalability, and reliability. Our solutions support your business growth and data management needs.",
    benefits: [
      "Optimized performance",
      "Scalability",
      "Data integrity",
      "Backup and recovery",
      "Security",
      "Cost efficiency",
    ],
    process: [
      "Requirements analysis",
      "Database design",
      "Implementation",
      "Performance tuning",
      "Backup strategy",
      "Monitoring setup",
      "Ongoing optimization",
    ],
    technologies: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Elasticsearch", "DynamoDB"],
  },
  "devops-infrastructure": {
    title: "DevOps & Infrastructure",
    description: "CI/CD pipelines, infrastructure automation, and deployment solutions",
    fullDescription:
      "We streamline your development and deployment processes with modern DevOps practices and infrastructure automation.",
    benefits: [
      "Faster deployment cycles",
      "Improved reliability",
      "Automated testing",
      "Infrastructure as code",
      "Monitoring and alerting",
      "Cost optimization",
    ],
    process: [
      "Current state assessment",
      "Pipeline design",
      "Tool selection and setup",
      "Automation implementation",
      "Testing integration",
      "Monitoring setup",
      "Team training",
    ],
    technologies: ["Jenkins", "GitLab CI", "GitHub Actions", "Docker", "Kubernetes", "Terraform"],
  },
  "digital-marketing": {
    title: "Digital Marketing",
    description: "SEO, content marketing, and digital advertising strategies",
    fullDescription:
      "Grow your online presence with our comprehensive digital marketing services. We help you reach your target audience and achieve your business goals.",
    benefits: [
      "Increased online visibility",
      "Higher search rankings",
      "More qualified leads",
      "Better ROI",
      "Brand awareness",
      "Customer engagement",
    ],
    process: [
      "Market and competitor analysis",
      "Strategy development",
      "Content creation",
      "SEO optimization",
      "Campaign execution",
      "Analytics and reporting",
      "Continuous optimization",
    ],
    technologies: ["Google Analytics", "SEMrush", "Ahrefs", "Content management systems", "Email marketing tools"],
  },
  "business-consulting": {
    title: "Business Consulting",
    description: "Technology strategy and business process optimization",
    fullDescription:
      "We provide strategic consulting to help your organization make informed technology decisions and optimize business processes.",
    benefits: [
      "Strategic alignment",
      "Process optimization",
      "Cost reduction",
      "Risk mitigation",
      "Competitive advantage",
      "Growth acceleration",
    ],
    process: [
      "Business assessment",
      "Gap analysis",
      "Strategy development",
      "Roadmap creation",
      "Implementation support",
      "Change management",
      "Performance tracking",
    ],
    technologies: ["Business intelligence tools", "Project management platforms", "Collaboration tools"],
  },
  "technical-support": {
    title: "Technical Support",
    description: "24/7 technical support and managed IT services",
    fullDescription:
      "Keep your systems running smoothly with our comprehensive technical support and managed IT services.",
    benefits: [
      "24/7 availability",
      "Quick response times",
      "Proactive monitoring",
      "Issue prevention",
      "Expert support team",
      "Cost predictability",
    ],
    process: [
      "Support plan customization",
      "System monitoring setup",
      "Incident response",
      "Issue resolution",
      "Documentation",
      "Regular reporting",
      "Continuous improvement",
    ],
    technologies: ["Monitoring tools", "Ticketing systems", "Remote support tools", "Knowledge bases"],
  },
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = serviceDetails[params.slug]

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Service Not Found</h1>
          <Link href="/services" className="text-primary hover:text-primary/80 font-semibold">
            Back to Services
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
          <Link href="/services" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowLeft size={20} />
            Back to Services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
          <p className="text-lg text-white/90">{service.description}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{service.fullDescription}</p>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Key Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-3">
                  <Check className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Our Process</h2>
            <div className="space-y-4">
              {service.process.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="pt-1">
                    <p className="text-foreground font-medium">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Technologies We Use</h2>
            <div className="flex flex-wrap gap-3">
              {service.technologies.map((tech, index) => (
                <span key={index} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 mb-8">
            Let's discuss how we can help you with {service.title.toLowerCase()}.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Contact Us <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
