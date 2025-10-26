import { Resend } from 'resend'

// Initialize Resend lazily to avoid errors during build
function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('Resend API key not configured')
    return null
  }
  return new Resend(apiKey)
}

export interface EmailData {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from = "Amass Tech Hub <noreply@amasstechhub.com>" }: EmailData) {
  try {
    const resend = getResend()
    if (!resend) {
      console.log('Email service not configured - would send:', { to, subject })
      return { success: true, message: 'Email service not configured' }
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Email error:', error)
      return { success: false, error: error.message }
    }

    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendContactFormEmail(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3c0a6b;">New Contact Form Submission</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #3c0a6b;">
          ${formData.message.replace(/\n/g, '<br>')}
        </div>
      </div>
      <p style="color: #666; font-size: 14px;">
        This message was sent from the Amass Tech Hub contact form.
      </p>
    </div>
  `

  return sendEmail({
    to: process.env.CONTACT_EMAIL || 'info@amasstechhub.com',
    subject: `Contact Form: ${formData.subject}`,
    html,
  })
}

export async function sendNewsletterConfirmationEmail(email: string, name?: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px;">
        <h1 style="color: #3c0a6b;">Welcome to Amass Tech Hub!</h1>
      </div>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p>Hi ${name || 'there'},</p>
        <p>Thank you for subscribing to our newsletter! You'll now receive:</p>
        <ul style="color: #3c0a6b;">
          <li>Latest tech news from Africa</li>
          <li>Exclusive insights and analysis</li>
          <li>Product reviews and tutorials</li>
          <li>Industry updates and trends</li>
        </ul>
        <p>We're excited to have you as part of our tech community!</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://www.amasstechhub.com" 
           style="background: #3c0a6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Visit Our Website
        </a>
      </div>
      <p style="color: #666; font-size: 14px; text-align: center;">
        If you didn't subscribe to our newsletter, you can ignore this email.
      </p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Welcome to Amass Tech Hub Newsletter!',
    html,
  })
}
