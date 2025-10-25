import { type NextRequest, NextResponse } from "next/server"

// Mock database for contact submissions
const contactSubmissions: Array<{
  id: string
  name: string
  email: string
  subject: string
  message: string
  submittedAt: Date
}> = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const submission = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      submittedAt: new Date(),
    }
    contactSubmissions.push(submission)

    console.log("[v0] Contact form submission:", submission)

    // In production, you would:
    // 1. Save to database (Supabase, Neon, etc.)
    // 2. Send email to info@amasstechhub.com via SendGrid, Resend, or Mailgun
    // 3. Send confirmation email to user
    // 4. Integrate with CRM (HubSpot, Pipedrive, etc.)
    // 5. Track event in analytics

    return NextResponse.json(
      {
        success: true,
        message: "Message received. We'll get back to you soon.",
        submissionId: submission.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
