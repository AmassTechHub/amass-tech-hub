# Deployment Guide

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase project with database access
- Vercel account (recommended) or another hosting provider

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth (if using authentication)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000  # Update for production

# Optional: Database URL for migrations
DATABASE_URL=postgresql://user:password@host:port/dbname
```

## Database Setup

1. Run database migrations:
   ```bash
   npx supabase db push
   ```

2. Verify all tables and RLS policies are created correctly in your Supabase dashboard.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Production Build

1. Create a production build:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Deployment to Vercel

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the repository to Vercel
3. Add the environment variables in the Vercel project settings
4. Deploy!

## Post-Deployment

1. Verify all admin routes are protected by authentication
2. Check that all database queries are working
3. Test form submissions and data updates
4. Verify static assets are loading correctly
