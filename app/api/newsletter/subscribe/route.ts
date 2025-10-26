import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from '@/lib/supabase'
import { sendNewsletterConfirmationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Check if database is available
    const hasDatabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (hasDatabase) {
      // Check if already subscribed
      const { data: existing } = await supabaseAdmin
        .from('newsletter_subscribers')
        .select('id, status')
        .eq('email', email)
        .single()

      if (existing) {
        if (existing.status === 'active') {
          return NextResponse.json({ error: "Already subscribed" }, { status: 400 })
        } else {
          // Reactivate subscription
          const { error: updateError } = await supabaseAdmin
            .from('newsletter_subscribers')
            .update({ 
              status: 'active',
              name: name || null,
              subscribed_at: new Date().toISOString()
            })
            .eq('id', existing.id)

          if (updateError) {
            console.error('Database error:', updateError)
            return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
          }

          console.log("[Newsletter] Subscription reactivated:", email)
          return NextResponse.json(
            {
              success: true,
              message: "Successfully resubscribed to newsletter",
              email: email,
            },
            { status: 201 },
          )
        }
      }

      // Add new subscriber
      const { data, error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .insert({
          email,
          name: name || null,
          status: 'active'
        })
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
      }

      console.log("[Newsletter] New subscriber added:", data.id)

      // Send confirmation email
      const emailResult = await sendNewsletterConfirmationEmail(email, name)
      if (emailResult.success) {
        console.log("[Newsletter] Confirmation email sent successfully")
      } else {
        console.error("[Newsletter] Failed to send confirmation email:", emailResult.error)
      }

      // In production, you would also:
      // 1. Integrate with email service API (Mailchimp, ConvertKit, etc.)
      // 2. Track event in analytics
      // 3. Add to marketing automation sequences

      return NextResponse.json(
        {
          success: true,
          message: "Successfully subscribed to newsletter",
          email: email,
        },
        { status: 201 },
      )
    } else {
      // Fallback when database is not configured
      console.log("[Newsletter] Subscription (no database):", email)
      
      return NextResponse.json(
        {
          success: true,
          message: "Successfully subscribed to newsletter",
          email: email,
        },
        { status: 201 },
      )
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
