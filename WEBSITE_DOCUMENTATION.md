# 📚 Complete Website Documentation

## 🗂️ Project Structure Overview

```
AmassTechHub Website/
├── app/                    # Next.js App Router (all pages)
├── components/             # Reusable React components
├── lib/                    # Utilities and helper functions
├── public/                 # Static assets (images, fonts)
├── hooks/                  # Custom React hooks
├── middleware.ts           # Route protection and authentication
└── Configuration files     # Package.json, tsconfig, etc.
```

---

## 📄 App Directory (`/app`)

This is where all your pages live. Each folder represents a route.

### Main Pages

**`app/page.tsx`** - Homepage
- What: Main landing page of the website
- Contains: Hero section, featured articles, categories
- Route: `/`

**`app/layout.tsx`** - Root layout
- What: Wraps all pages with common elements
- Contains: Header, Footer, theme provider, analytics
- Used by: Every page automatically

**`app/not-found.tsx`** - 404 error page
- What: Shows when page not found
- Route: Any invalid URL
- Contains: Error message and "Go Home" button

### News/Articles

**`app/news/page.tsx`** - News listing page
- What: Lists all news articles
- Route: `/news`
- Features: Pagination, filtering

**`app/news/[id]/page.tsx`** - Article detail page
- What: Displays a single article
- Route: `/news/article-slug`
- Features: Full content, related articles, sharing

**`app/news/loading.tsx`** - Loading state
- What: Shows while loading articles
- Used by: News pages

### Admin Dashboard

**`app/admin/layout.tsx`** - Admin layout (PROTECTED)
- What: Wraps all admin pages
- Features: Authentication check, sidebar, header
- Access: Only logged-in admins
- Redirects to: `/auth/login` if not authenticated

**`app/admin/page.tsx`** - Admin dashboard
- What: Main admin overview
- Route: `/admin`
- Features: Stats, charts, metrics
- Data: Real data from database (no fake data)

**`app/admin/posts/page.tsx`** - Posts management
- What: Manage all blog posts
- Route: `/admin/posts`
- Features: View, edit, delete posts
- Actions: Publish/unpublish, delete

**`app/admin/posts/new/page.tsx`** - Create new post
- What: Form to create new article
- Route: `/admin/posts/new`
- Features: Rich text editor, SEO settings, images

**`app/admin/analytics/page.tsx`** - Analytics
- What: Content performance metrics
- Route: `/admin/analytics`
- Features: Top performing content, engagement charts

**`app/admin/content-performance/page.tsx`** - Content performance
- What: Detailed content metrics
- Route: `/admin/content-performance`
- Features: Views, shares, engagement data

### Authentication

**`app/auth/login/page.tsx`** - Login page
- What: Admin login form
- Route: `/auth/login`
- Credentials: Check `lib/auth.ts`

**`app/auth/signup/page.tsx`** - Signup page
- What: User registration
- Route: `/auth/signup`

### Other Pages

**`app/about/page.tsx`** - About Us
- Route: `/about`
- Contains: Company information

**`app/contact/page.tsx`** - Contact page
- Route: `/contact`
- Features: Contact form, sends to API

**`app/search/page.tsx`** - Search results
- Route: `/search?q=query`
- Features: Search articles

**`app/jobs/page.tsx`** - Jobs listing
- Route: `/jobs`
- Contains: Job postings

**`app/podcasts/page.tsx`** - Podcasts
- Route: `/podcasts`
- Contains: Podcast listings

**`app/reviews/page.tsx`** - Reviews
- Route: `/reviews`
- Contains: Product reviews

**`app/tools/page.tsx`** - Tools
- Route: `/tools`
- Contains: Tech tools directory

**`app/tutorials/page.tsx`** - Tutorials
- Route: `/tutorials`
- Contains: Tutorial articles

**`app/services/page.tsx`** - Services
- Route: `/services`
- Contains: Company services

**`app/services/[slug]/page.tsx`** - Service detail
- Route: `/services/service-name`
- Contains: Individual service details

**`app/community/page.tsx`** - Community
- Route: `/community`
- Contains: Community information

**`app/events/page.tsx`** - Events
- Route: `/events`
- Contains: Upcoming events

**`app/premium/page.tsx`** - Premium
- Route: `/premium`
- Contains: Premium membership info

**`app/sponsorship/page.tsx`** - Sponsorship
- Route: `/sponsorship`
- Contains: Sponsorship opportunities

**`app/affiliate/page.tsx`** - Affiliate
- Route: `/affiliate`
- Contains: Affiliate program

**`app/advertise/page.tsx`** - Advertising
- Route: `/advertise`
- Contains: Advertise with us

**`app/dashboard/page.tsx`** - User dashboard
- Route: `/dashboard`
- Contains: User profile/account

---

## 🧩 Components Directory (`/components`)

### Admin Components

**`components/admin/sidebar.tsx`**
- What: Left navigation in admin panel
- Used in: All admin pages
- Features: Mobile responsive, logout button

**`components/admin/header.tsx`**
- What: Top bar in admin panel
- Used in: All admin pages
- Features: Welcome message, notifications

**`components/admin/analytics-nav.tsx`**
- What: Navigation for analytics section
- Used in: Analytics pages

### Authentication

**`components/auth-provider.tsx`**
- What: Provides auth context to whole app
- Used in: Root layout
- Features: Session management

### Content

**`components/content/`** - Content display components
- Article cards, featured content, etc.

### Home

**`components/home/`** - Homepage sections
- Hero, features, testimonials, etc.

### Layout

**`components/layout/header.tsx`**
- What: Main site header/navigation
- Used in: All public pages
- Features: Logo, menu, mobile menu

**`components/layout/footer.tsx`**
- What: Site footer
- Used in: All pages
- Features: Links, social media, copyright

**`components/theme-provider.tsx`**
- What: Dark/light theme toggle
- Features: System preference detection

### News

**`components/news/related-articles.tsx`**
- What: Shows related articles
- Used in: Article detail page

### UI Components

**`components/ui/`** - 59 UI components
- Buttons, cards, inputs, dialogs, etc.
- Built with Radix UI
- All styled with Tailwind CSS
- Location for: Forms, modals, dropdowns

---

## 🔧 Library Functions (`/lib`)

### Authentication

**`lib/auth.ts`**
- What: NextAuth configuration
- Contains: Login logic, session management
- Admin credentials: Check here for login details

**`lib/auth-context.tsx`**
- What: React context for auth state
- Used by: Components needing user data

### Email

**`lib/email.ts`** ⭐ IMPORTANT
- What: Email sending functions
- Service: Resend API
- Functions: `sendEmail()`, `sendContactFormEmail()`, etc.
- API Key: Set in environment variables

### Database

**`lib/supabase.ts`**
- What: Supabase database connection
- Client: For public queries
- Admin: For admin operations

### Content

**`lib/real-content.ts`**
- What: Real article fetching
- Functions: Get articles from database
- Used in: News pages, admin

**`lib/cms-data.ts`**
- What: Content management utilities
- Contains: Helper functions for content

**`lib/content-management.ts`**
- What: Content CRUD operations
- Used in: Admin post management

**`lib/content-utils.ts`**
- What: Content formatting helpers
- Features: Slug generation, excerpt, etc.

### Analytics & SEO

**`lib/analytics.ts`**
- What: Analytics tracking
- Service: Google Analytics integration

**`lib/seo.ts`**
- What: SEO utilities
- Features: Meta tags, structured data

**`lib/performance.ts`**
- What: Performance monitoring
- Features: Page load tracking

### Utilities

**`lib/utils.ts`**
- What: General helper functions
- Contains: Common utilities

**`lib/types.ts`**
- What: TypeScript type definitions
- Contains: All data types used in app

**`lib/fallback-data.ts`**
- What: Backup data when DB unavailable
- Contains: Sample articles (not used in prod)

---

## 🔌 API Routes (`/app/api`)

These handle backend logic.

### Articles

**`app/api/articles/route.ts`** - GET all, POST new
**`app/api/articles/[id]/route.ts`** - GET one, PUT update, DELETE

### Authentication

**`app/api/auth/[...nextauth]/route.ts`** - NextAuth handlers
**`app/api/auth/[...nextauth]/`** - Other auth endpoints

### Categories

**`app/api/categories/route.ts`** - Manage categories

### Contact

**`app/api/contact/route.ts`** - Handle contact form
- Sends to: Email via Resend

### Newsletter

**`app/api/newsletter/route.ts`** - Subscribe/unsubscribe
- Sends: Confirmation emails

### Authors

**`app/api/authors/route.ts`** - Get authors

### Comments

**`app/api/comments/route.ts`** - Manage comments

### Search

**`app/api/search/route.ts`** - Search functionality

---

## 🖼️ Public Assets (`/public`)

All images and static files:

**`/public/*.jpg, *.png`** - Images
- Feature images for articles
- Logos and graphics
- Placeholder images

**`/public/manifest.json`** - PWA manifest
- What: Makes site installable as app

**`/public/service-worker.js`** - Offline functionality

---

## ⚙️ Configuration Files

**`package.json`** - Dependencies and scripts
- Run: `npm run dev` - Start dev server
- Run: `npm run build` - Build for production

**`next.config.mjs`** - Next.js configuration
- Image domains, redirects, etc.

**`tsconfig.json`** - TypeScript configuration

**`tailwind.config.js`** - Tailwind CSS setup
- Custom colors: primary (#3c0a6b), accent (#d6a51b)

**`middleware.ts`** - Route middleware
- What: Protects routes, handles redirects
- Uses: NextAuth for authentication

**`.env.local`** ⭐ IMPORTANT
- What: Local environment variables
- Contains: API keys, passwords (DO NOT COMMIT)

---

## 🔐 Environment Variables Needed

Create `.env.local` with:

```env
# Required
RESEND_API_KEY=re_your_key_here
ADMIN_PASSWORD=your_password
ADMIN_EMAIL=admin@example.com

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For Vercel, add these in Settings → Environment Variables

---

## 📝 Creating New Content

### To create a new blog post:

1. Login to admin: `/auth/login`
2. Go to: `/admin/posts`
3. Click: "New Post"
4. Fill in:
   - Title
   - Excerpt
   - Content
   - Category
   - Author
   - Featured image URL
   - Tags
   - Status (draft/published)
5. Click: "Save Article"

### To edit existing post:

1. Go to: `/admin/posts`
2. Click edit icon on desired post
3. Make changes
4. Save

---

## 🎨 Customization Guide

### Change Site Colors
Edit: `app/globals.css`
Look for: CSS variables like `--primary`, `--accent`

### Change Navigation
Edit: `components/layout/header.tsx`
Modify: Menu items array

### Add New Page
1. Create file: `app/your-page/page.tsx`
2. Add content
3. Auto-accessible at: `/your-page`

### Modify Homepage
Edit: `app/page.tsx`
Contains: Hero, features, testimonials

---

## 🐛 Troubleshooting

### Build fails on Vercel
Check: Environment variables are set correctly

### Can't login to admin
Check: `lib/auth.ts` for credentials
Or: Environment variables `ADMIN_PASSWORD`, `ADMIN_EMAIL`

### Emails not sending
Check: `lib/email.ts` has correct API key
Verify: Resend account is active

### Images not loading
Check: `next.config.mjs` has correct image domains
Or: Upload images to a hosting service

---

## 🚀 Deployment Checklist

- [ ] Add RESEND_API_KEY to Vercel
- [ ] Add ADMIN_PASSWORD to Vercel
- [ ] Add ADMIN_EMAIL to Vercel
- [ ] Push code to GitHub
- [ ] Vercel auto-deploys
- [ ] Test login at `/auth/login`
- [ ] Test admin panel at `/admin`
- [ ] Create first blog post

---

## 📞 Key Files Quick Reference

| Need to... | Go to... |
|-----------|----------|
| Create blog post | `/admin/posts/new` |
| View all posts | `/admin/posts` |
| See analytics | `/admin/analytics` |
| Change site colors | `app/globals.css` |
| Modify header/menu | `components/layout/header.tsx` |
| Edit homepage | `app/page.tsx` |
| Change email settings | `lib/email.ts` |
| Update admin login | `lib/auth.ts` |
| Add new page | `app/new-page/page.tsx` |

---

## 📚 Next Steps

1. **Add environment variables** to Vercel
2. **Login to admin**: `/auth/login`
3. **Create your first post**: `/admin/posts/new`
4. **Customize content**: Edit pages in `/app`
5. **Upload real images**: Replace placeholders in `/public`

ushi>
