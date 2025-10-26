# 🚀 COMPLETE ENVIRONMENT VARIABLES SETUP

# Copy this file to .env.local and fill in your actual values

# ===========================================
# DATABASE (Supabase) - REQUIRED
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ===========================================
# AUTHENTICATION - REQUIRED
# ===========================================
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@amasstechhub.com
ADMIN_PASSWORD=your-secure-admin-password

# ===========================================
# EMAIL SERVICE - REQUIRED
# ===========================================
# Choose ONE email service:

# Option 1: Resend (Recommended)
RESEND_API_KEY=re_your_resend_api_key

# Option 2: SendGrid
# SENDGRID_API_KEY=SG.your_sendgrid_key

# Option 3: Mailgun
# MAILGUN_API_KEY=your_mailgun_key
# MAILGUN_DOMAIN=your_mailgun_domain

# ===========================================
# EMAIL CONFIGURATION
# ===========================================
CONTACT_EMAIL=info@amasstechhub.com
FROM_EMAIL=noreply@amasstechhub.com

# ===========================================
# NEWSLETTER SERVICE (Optional)
# ===========================================
# Choose ONE newsletter service:

# Option 1: Mailchimp
# MAILCHIMP_API_KEY=your_mailchimp_key
# MAILCHIMP_LIST_ID=your_list_id

# Option 2: ConvertKit
# CONVERTKIT_API_KEY=your_convertkit_key

# ===========================================
# IMAGE HOSTING (Optional)
# ===========================================
# Cloudinary (Recommended)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# ===========================================
# ANALYTICS (Optional)
# ===========================================
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX

# ===========================================
# SOCIAL MEDIA (Optional)
# ===========================================
FACEBOOK_PAGE_ID=your_facebook_page_id
TWITTER_USERNAME=your_twitter_username
INSTAGRAM_USERNAME=your_instagram_username
LINKEDIN_COMPANY_ID=your_linkedin_company_id
YOUTUBE_CHANNEL_ID=your_youtube_channel_id

# ===========================================
# THIRD-PARTY SERVICES (Optional)
# ===========================================
# Stripe (for payments)
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...

# Cloudflare (for CDN)
# CLOUDFLARE_API_TOKEN=your_cloudflare_token
# CLOUDFLARE_ZONE_ID=your_zone_id

# ===========================================
# DEVELOPMENT
# ===========================================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===========================================
# PRODUCTION OVERRIDES
# ===========================================
# Uncomment and update for production:
# NODE_ENV=production
# NEXT_PUBLIC_APP_URL=https://www.amasstechhub.com
# NEXTAUTH_URL=https://www.amasstechhub.com
