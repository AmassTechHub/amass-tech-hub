import { Users, Target, Award, Globe } from "lucide-react"

export default function AboutPage() {
  const team = [
    {
      name: "Theophilus Amankwah",
      role: "Founder & CEO",
      bio: "Tech entrepreneur with 5+ years of experience in digital innovation",
      image: "/AMASS.jpg",
    },
    {
      name: "James Mwangi",
      role: "Chief Technology Officer",
      bio: "Software architect specializing in scalable systems and cloud infrastructure",
      image: "/team-member-2.jpg",
    },
    {
      name: "Amara Obi",
      role: "Head of Content",
      bio: "Journalist and tech writer with expertise in African tech ecosystem",
      image: "/team-member-3.jpg",
    },
    {
      name: "David Kipchoge",
      role: "Head of Services",
      bio: "Business consultant with proven track record in digital transformation",
      image: "/team-member-4.jpg",
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to advancing technology adoption across Africa",
    },
    {
      icon: Users,
      title: "Community-Focused",
      description: "Building a vibrant community of tech enthusiasts and professionals",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Delivering high-quality content and services that exceed expectations",
    },
    {
      icon: Globe,
      title: "Inclusive",
      description: "Making tech knowledge accessible to everyone regardless of background",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Amass Tech Hub</h1>
          <p className="text-lg text-white/90">
            Africa's premier platform for tech news, insights, and digital solutions
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              Amass Tech Hub was founded with a simple mission: to be Africa's most trusted source for technology news,
              insights, and digital solutions. We recognized a gap in the market for quality tech content tailored to
              the African context.
            </p>
            <p>
              Since our launch, we've grown to become a leading voice in the African tech ecosystem, serving millions of
              readers, businesses, and professionals across the continent. Our platform has become a go-to resource for
              staying informed about the latest tech developments and trends.
            </p>
            <p>
              Today, we continue to expand our offerings, combining high-quality journalism with practical digital
              solutions to help businesses and individuals thrive in the digital age.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-card py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="p-6 bg-background rounded-lg border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 overflow-hidden rounded-lg h-64 bg-muted">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5M+</div>
              <p className="text-white/80">Monthly Readers</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <p className="text-white/80">Articles Published</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <p className="text-white/80">Countries Reached</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <p className="text-white/80">Expert Contributors</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
