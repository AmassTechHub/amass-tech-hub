import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from '@/lib/supabase'
import { sendContactFormEmail } from '@/lib/email'

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

    // Check if database is available
    const hasDatabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (hasDatabase) {
      // Save to database
      const { data, error } = await supabaseAdmin
        .from('contact_submissions')
        .insert({
          name,
          email,
          subject,
          message,
          status: 'new'
        })
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
      }

      console.log("[Contact] Form submission saved to database:", data.id)

      // Send email notification
      const emailResult = await sendContactFormEmail({ name, email, subject, message })
      if (emailResult.success) {
        console.log("[Contact] Email notification sent successfully")
      } else {
        console.error("[Contact] Failed to send email:", emailResult.error)
      }

      // In production, you would also:
      // 1. Send confirmation email to user
      // 2. Integrate with CRM (HubSpot, Pipedrive, etc.)
      // 3. Track event in analytics

      return NextResponse.json(
        {
          success: true,
          message: "Message received. We'll get back to you soon.",
          submissionId: data.id,
        },
        { status: 201 },
      )
    } else {
      // Fallback when database is not configured
      console.log("[Contact] Form submission (no database):", { name, email, subject })
      
      return NextResponse.json(
        {
          success: true,
          message: "Message received. We'll get back to you soon.",
          submissionId: Date.now().toString(),
        },
        { status: 201 },
      )
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
