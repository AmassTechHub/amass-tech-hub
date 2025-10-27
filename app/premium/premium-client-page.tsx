"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function PremiumClientPage() {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for casual readers",
      features: [
        "Access to all public articles",
        "Weekly newsletter",
        "Community access",
        "Display ads",
        "Basic search",
      ],
      cta: "Current Plan",
      ctaDisabled: user?.stats.membershipTier === "free",
      color: "gray",
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "For serious tech enthusiasts",
      features: [
        "Ad-free reading",
        "Exclusive articles",
        "Early access to content",
        "Offline reading",
        "Advanced search",
        "Personalized recommendations",
        "Priority support",
      ],
      cta: "Upgrade to Pro",
      ctaDisabled: user?.stats.membershipTier === "pro",
      color: "purple",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team accounts",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "Content licensing",
        "Analytics dashboard",
      ],
      cta: "Contact Sales",
      ctaDisabled: false,
      color: "yellow",
    },
  ]

  const handleUpgrade = (plan: string) => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (plan === "Enterprise") {
      window.location.href = "mailto:business@amasstechhub.com?subject=Enterprise%20Plan%20Inquiry"
    } else {
      // TODO: Integrate with Stripe or payment provider
      alert(`Upgrading to ${plan} plan...`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Unlock premium features and support the future of African tech journalism
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 ${
                plan.popular ? "ring-2 ring-purple-600 md:scale-105" : ""
              }`}
            >
              <div className={`bg-${plan.color}-600 text-white p-6`}>
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-sm opacity-90">{plan.description}</p>
              </div>

              <div className="bg-white p-6">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={plan.ctaDisabled}
                  className={`w-full py-3 rounded-lg font-bold transition ${
                    plan.ctaDisabled
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : plan.color === "purple"
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : plan.color === "yellow"
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time with no penalties.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and mobile money payments.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes, new Pro subscribers get a 7-day free trial before being charged.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
