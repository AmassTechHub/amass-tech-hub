import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const subscribers: Map<string, { email: string; subscribedAt: Date }> = new Map()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Check if already subscribed
    if (subscribers.has(email)) {
      return NextResponse.json({ error: "Already subscribed" }, { status: 400 })
    }

    // Add to subscribers
    subscribers.set(email, {
      email,
      subscribedAt: new Date(),
    })

    console.log("[v0] New newsletter subscriber:", email)

    // In production, you would:
    // 1. Save to database (Supabase, Neon, etc.)
    // 2. Send confirmation email via SendGrid, Mailchimp, or Resend
    // 3. Integrate with email service API
    // 4. Track event in analytics

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter",
        email: email,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
