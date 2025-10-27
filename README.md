# Amass Tech Hub

A modern, responsive tech news website built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with full responsiveness
- **Admin Dashboard**: Protected admin panel with authentication
- **Content Management**: Create, edit, and publish blog posts
- **Real-time Analytics**: View content performance and engagement metrics
- **Email Service**: Integrated with Resend for notifications
- **SEO Optimized**: Built-in SEO features for better search visibility

## 📋 Requirements

- Node.js >= 20.9.0
- npm or yarn

## 🛠️ Setup

1. Clone the repository:
```bash
git clone https://github.com/AmassTechHub/amass-tech-hub.git
cd amass-tech-hub
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
# Required
RESEND_API_KEY=re_your_api_key_here
ADMIN_PASSWORD=your_secure_password
ADMIN_EMAIL=****.com

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Access

1. Navigate to `/auth/login`
2. Login with your admin credentials
3. Access the admin dashboard at `/admin`

## 📝 Creating Content

1. Login to the admin panel
2. Navigate to "Posts" in the sidebar
3. Click "New Post"
4. Fill in the article details
5. Publish when ready

## 🌐 Deployment

The site is configured for Vercel deployment:

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Required Vercel Environment Variables:
- `RESEND_API_KEY` - Your Resend API key
- `ADMIN_PASSWORD` - Admin password
- `ADMIN_EMAIL` - Admin email

## 📦 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Authentication**: NextAuth.js
- **Email**: Resend

## 📄 License

MIT
