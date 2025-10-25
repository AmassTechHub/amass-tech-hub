export const emailTemplates = {
  newsletter_welcome: (email: string) => ({
    subject: "Welcome to Amass Tech Hub Newsletter",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3c0a6b;">Welcome to Amass Tech Hub!</h1>
        <p>Hi there,</p>
        <p>Thank you for subscribing to our newsletter. You'll now receive the latest tech news, reviews, tutorials, and insights delivered to your inbox weekly.</p>
        <p>Stay tuned for:</p>
        <ul>
          <li>Breaking tech news from across Africa</li>
          <li>In-depth product reviews</li>
          <li>Practical tutorials and guides</li>
          <li>Curated tools and resources</li>
        </ul>
        <p>Best regards,<br/>The Amass Tech Hub Team</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">
          You're receiving this email because you subscribed to Amass Tech Hub newsletter.
          <a href="https://www.amasstechhub.com/unsubscribe?email=${email}">Unsubscribe</a>
        </p>
      </div>
    `,
  }),

  contact_confirmation: (name: string, subject: string) => ({
    subject: "We received your message - Amass Tech Hub",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3c0a6b;">Thank You for Contacting Us</h1>
        <p>Hi ${name},</p>
        <p>We've received your message regarding <strong>${subject}</strong>.</p>
        <p>Our team will review your inquiry and get back to you as soon as possible, typically within 24-48 hours.</p>
        <p>In the meantime, feel free to explore our:</p>
        <ul>
          <li><a href="https://www.amasstechhub.com/news">Latest News</a></li>
          <li><a href="https://www.amasstechhub.com/services">Services</a></li>
          <li><a href="https://www.amasstechhub.com/tutorials">Tutorials</a></li>
        </ul>
        <p>Best regards,<br/>The Amass Tech Hub Team</p>
      </div>
    `,
  }),

  admin_notification: (name: string, email: string, subject: string, message: string) => ({
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3c0a6b;">New Contact Form Submission</h1>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
        <p><a href="https://www.amasstechhub.com/admin/contact" style="background-color: #3c0a6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View in Admin</a></p>
      </div>
    `,
  }),
}
