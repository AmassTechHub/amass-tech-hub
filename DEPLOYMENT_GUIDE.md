# Amass Tech Hub - Deployment & Setup Guide

## Overview
This guide walks you through deploying the Amass Tech Hub website to production and configuring all necessary integrations.

---

## 1. Deploy to Vercel

### Step 1: Push to GitHub
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/amass-tech-hub.git
git push -u origin main
\`\`\`

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"
5. Your site will be live at `https://amass-tech-hub.vercel.app`

---

## 2. Connect Custom Domain

### Step 1: Update Domain DNS
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS settings
3. Add these records:
   - **Type:** A
   - **Name:** @
   - **Value:** `76.76.19.165`
   
   And:
   - **Type:** CNAME
   - **Name:** www
   - **Value:** `cname.vercel-dns.com`

### Step 2: Add Domain to Vercel
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Enter `www.amasstechhub.com`
4. Click "Add"
5. Vercel will verify DNS and enable HTTPS automatically

**Result:** Your site is now live at `https://www.amasstechhub.com`

---

## 3. Setup Environment Variables

### In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add the following variables:

\`\`\`
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Email Service (choose one)
SENDGRID_API_KEY=your_sendgrid_key
# OR
RESEND_API_KEY=your_resend_key
# OR
MAILGUN_API_KEY=your_mailgun_key

# Database (optional)
DATABASE_URL=your_database_url

# Admin Authentication
ADMIN_PASSWORD=your_secure_password
\`\`\`

---

## 4. Setup Google Analytics

### Step 1: Create Google Analytics Account
1. Go to [analytics.google.com](https://analytics.google.com)
2. Click "Start measuring"
3. Enter property name: "Amass Tech Hub"
4. Select "Web"
5. Enter website URL: `https://www.amasstechhub.com`

### Step 2: Get Measurement ID
1. In Google Analytics, go to Admin → Property Settings
2. Copy the "Measurement ID" (starts with G-)
3. Add to Vercel environment variables as `NEXT_PUBLIC_GA_ID`

### Step 3: Verify Tracking
1. Deploy the changes
2. Visit your website
3. In Google Analytics, go to Real-time → Overview
4. You should see active users

---

## 5. Setup Email Service

### Option A: SendGrid
1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up and verify email
3. Go to Settings → API Keys
4. Create new API key
5. Add to Vercel as `SENDGRID_API_KEY`

### Option B: Resend (Recommended)
1. Go to [resend.com](https://resend.com)
2. Sign up
3. Go to API Keys
4. Copy your API key
5. Add to Vercel as `RESEND_API_KEY`

### Option C: Mailgun
1. Go to [mailgun.com](https://mailgun.com)
2. Sign up
3. Go to API Security
4. Copy API key
5. Add to Vercel as `MAILGUN_API_KEY`

---

## 6. Setup Newsletter Integration

### With Mailchimp:
1. Go to [mailchimp.com](https://mailchimp.com)
2. Create account and audience
3. Go to Audience → Settings → API keys
4. Copy API key
5. Update `/app/api/newsletter/subscribe/route.ts` to integrate

### With ConvertKit:
1. Go to [convertkit.com](https://convertkit.com)
2. Create account
3. Go to Settings → API
4. Copy API key
5. Update `/app/api/newsletter/subscribe/route.ts` to integrate

---

## 7. Setup Contact Form Email

### Update Contact Form to Send Emails:

Edit `/app/api/contact/route.ts` and add email sending:

\`\`\`typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In the POST handler, after validation:
await resend.emails.send({
  from: 'noreply@amasstechhub.com',
  to: 'info@amasstechhub.com',
  subject: `New Contact: ${subject}`,
  html: `<p>From: ${name} (${email})</p><p>${message}</p>`
});

// Send confirmation to user
await resend.emails.send({
  from: 'noreply@amasstechhub.com',
  to: email,
  subject: 'We received your message',
  html: `<p>Hi ${name}, thanks for contacting us!</p>`
});
\`\`\`

---

## 8. Admin Dashboard Access

### Login to Admin:
1. Visit `https://www.amasstechhub.com/admin`
2. Enter admin password (from environment variables)
3. You can now:
   - View dashboard analytics
   - Create new posts
   - Manage subscribers
   - Update settings

### Create Your First Post:
1. Click "Posts" in sidebar
2. Click "New Post"
3. Fill in:
   - Title
   - Category (News, Reviews, Tutorials, Tools)
   - Content
   - Featured image
4. Click "Save Post"
5. Post appears on website immediately

---

## 9. SSL Certificate & Security

### HTTPS is Automatic:
- Vercel automatically provides SSL certificates
- All traffic is encrypted
- No additional setup needed

### Security Best Practices:
1. Keep admin password strong
2. Use environment variables for sensitive data
3. Enable two-factor authentication on Vercel
4. Regularly update dependencies

---

## 10. Performance Optimization

### Vercel Analytics:
1. In Vercel dashboard, go to Analytics
2. Monitor Core Web Vitals
3. Check page performance

### Image Optimization:
- All images are automatically optimized by Next.js
- Use `/placeholder.svg?height=X&width=Y&query=description` for placeholders

### Caching:
- Static pages are cached globally
- Dynamic content is cached intelligently
- No additional configuration needed

---

## 11. Database Setup (Optional)

### For Production Data Storage:

#### Option A: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Go to Settings → API
4. Copy `DATABASE_URL`
5. Add to Vercel environment variables

#### Option B: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create project
3. Copy connection string
4. Add to Vercel environment variables

#### Option C: PlanetScale
1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Copy connection string
4. Add to Vercel environment variables

---

## 12. Monitoring & Maintenance

### Weekly Tasks:
- Check Google Analytics for traffic
- Review contact form submissions
- Monitor newsletter subscriber growth

### Monthly Tasks:
- Update blog posts
- Review performance metrics
- Check for security updates

### Quarterly Tasks:
- Backup database
- Review and update content
- Analyze user behavior

---

## 13. Troubleshooting

### Site Not Loading:
1. Check Vercel deployment status
2. Verify domain DNS settings
3. Clear browser cache

### Emails Not Sending:
1. Verify API key in environment variables
2. Check email service dashboard
3. Review API logs for errors

### Analytics Not Tracking:
1. Verify `NEXT_PUBLIC_GA_ID` is set
2. Check Google Analytics real-time data
3. Clear browser cache and reload

### Admin Dashboard Not Accessible:
1. Verify admin password is correct
2. Check browser console for errors
3. Try incognito/private browsing

---

## 14. Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Google Analytics Help:** https://support.google.com/analytics
- **Email Service Docs:** Check your provider's documentation

---

## Quick Checklist

- [ ] Repository pushed to GitHub
- [ ] Project deployed on Vercel
- [ ] Custom domain connected
- [ ] Environment variables added
- [ ] Google Analytics configured
- [ ] Email service setup
- [ ] Newsletter integration complete
- [ ] Contact form emails working
- [ ] Admin dashboard accessible
- [ ] SSL certificate active
- [ ] Performance optimized
- [ ] Monitoring setup

---

**Congratulations! Your Amass Tech Hub website is now live and ready to manage!**
