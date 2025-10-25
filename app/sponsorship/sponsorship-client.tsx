"use client"

import { useState } from "react"

export default function SponsorshipClientPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const packages = [
    {
      id: "bronze",
      name: "Bronze",
      price: "$2,000",
      period: "per month",
      description: "Perfect for startups and small companies",
      features: [
        "Logo on website footer",
        "1 sponsored article per month",
        "Social media mention",
        "Newsletter feature (1x)",
        "Basic analytics",
      ],
    },
    {
      id: "silver",
      name: "Silver",
      price: "$5,000",
      period: "per month",
      description: "Great for growing companies",
      features: [
        "Logo on website sidebar",
        "2 sponsored articles per month",
        "Weekly social media mentions",
        "Newsletter feature (2x)",
        "Podcast sponsorship",
        "Advanced analytics",
      ],
      popular: true,
    },
    {
      id: "gold",
      name: "Gold",
      price: "$10,000",
      period: "per month",
      description: "For established brands",
      features: [
        "Logo on homepage",
        "4 sponsored articles per month",
        "Daily social media mentions",
        "Newsletter feature (4x)",
        "Podcast sponsorship (2 episodes)",
        "Event sponsorship",
        "Premium analytics",
        "Dedicated account manager",
      ],
    },
    {
      id: "platinum",
      name: "Platinum",
      price: "Custom",
      period: "contact us",
      description: "Enterprise-level sponsorship",
      features: [
        "Everything in Gold",
        "Custom content creation",
        "Exclusive partnership opportunities",
        "Co-branded content",
        "Priority placement",
        "Quarterly business reviews",
      ],
    },
  ]

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId)
    // TODO: Redirect to sponsorship inquiry form or payment
    window.location.href = `mailto:sponsorship@amasstechhub.com?subject=Sponsorship%20Inquiry%20-%20${packageId}`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">Sponsorship Opportunities</h1>
          <p className="text-xl text-gray-600">
            Reach thousands of tech professionals and decision-makers across Africa
          </p>
        </div>

        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Why Sponsor Amass Tech Hub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-bold text-gray-900 mb-2">Growing Audience</h3>
                <p className="text-gray-600">50,000+ monthly readers and growing</p>
              </div>
              <div>
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-gray-900 mb-2">Targeted Reach</h3>
                <p className="text-gray-600">Tech professionals, founders, and decision-makers</p>
              </div>
              <div>
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold text-gray-900 mb-2">Measurable Results</h3>
                <p className="text-gray-600">Detailed analytics and ROI tracking</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-lg shadow-lg overflow-hidden transition transform ${
                pkg.popular ? "ring-2 ring-purple-600 md:scale-105" : ""
              } ${selectedPackage === pkg.id ? "ring-2 ring-yellow-500" : ""}`}
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">{pkg.name}</h2>
                <p className="text-sm opacity-90">{pkg.description}</p>
              </div>

              <div className="bg-white p-6">
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
                  <span className="text-gray-600 ml-2">/{pkg.period}</span>
                </div>

                <ul className="space-y-2 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-purple-600 font-bold">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPackage(pkg.id)}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-bold transition"
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Our Sponsors</h2>
          <p className="text-gray-600 mb-8">Join leading companies that trust Amass Tech Hub</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["TechCorp", "StartupXYZ", "CloudServices", "DevTools"].map((sponsor) => (
              <div key={sponsor} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-gray-300 mb-2">{sponsor.charAt(0)}</div>
                <p className="font-medium text-gray-700">{sponsor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
