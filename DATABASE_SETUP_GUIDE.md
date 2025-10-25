# 🗄️ Database Setup Guide - Amass Tech Hub

## 🎯 **RECOMMENDED: Supabase (Free & Easy)**

### **Why Supabase:**
- ✅ **Free tier** - 500MB database, 1GB bandwidth
- ✅ **PostgreSQL** - Industry standard database
- ✅ **Real-time features** - Live updates
- ✅ **Built-in authentication** - User management
- ✅ **File storage** - Images and documents
- ✅ **Easy integration** - Simple API

### **Setup Steps:**

#### **Step 1: Create Supabase Project (5 minutes)**
1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up for free account**
3. **Click "New Project"**
4. **Enter project name**: "Amass Tech Hub"
5. **Choose region**: "Africa (Cape Town)" or closest to Ghana
6. **Set database password** (save this!)
7. **Click "Create new project"**

#### **Step 2: Get Database Credentials (2 minutes)**
1. **Go to Settings → API**
2. **Copy these values:**
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### **Step 3: Add to Vercel Environment Variables**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 **DATABASE SCHEMA**

### **Tables to Create:**

```sql
-- Articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  author_id UUID REFERENCES authors(id),
  image_url VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Authors table
CREATE TABLE authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'author',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3C0A6B',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  preferences JSONB
);

-- Contact form submissions
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 **IMPLEMENTATION STEPS**

### **Step 1: Install Supabase Client**
```bash
npm install @supabase/supabase-js
```

### **Step 2: Create Database Connection**
- Create `lib/supabase.ts` for database connection
- Add environment variables to Vercel

### **Step 3: Create API Routes**
- `/api/articles` - CRUD operations for articles
- `/api/categories` - Category management
- `/api/contact` - Contact form submissions
- `/api/subscribers` - Newsletter management

### **Step 4: Update Admin Dashboard**
- Real data from database
- Functional CRUD operations
- Image upload functionality
- Category management
- User management

## 🚀 **ADMIN FEATURES TO IMPLEMENT**

### **Content Management:**
- ✅ **Create/Edit/Delete Articles**
- ✅ **Category Management**
- ✅ **Image Upload**
- ✅ **Draft/Published Status**
- ✅ **SEO Settings**

### **User Management:**
- ✅ **Author Management**
- ✅ **Role-based Access**
- ✅ **User Authentication**

### **Analytics:**
- ✅ **Article Views**
- ✅ **Popular Content**
- ✅ **User Engagement**

### **Settings:**
- ✅ **Site Configuration**
- ✅ **Email Settings**
- ✅ **Social Media Links**
- ✅ **SEO Settings**

## 📋 **SETUP CHECKLIST**

- [ ] **Create Supabase project**
- [ ] **Add environment variables to Vercel**
- [ ] **Create database tables**
- [ ] **Install Supabase client**
- [ ] **Create API routes**
- [ ] **Update admin dashboard**
- [ ] **Test all functionality**
- [ ] **Deploy to production**

## 🎯 **NEXT STEPS**

1. **Set up Supabase database** (10 minutes)
2. **Add environment variables** (2 minutes)
3. **Create database tables** (5 minutes)
4. **Implement API routes** (30 minutes)
5. **Update admin dashboard** (30 minutes)
6. **Test all functionality** (15 minutes)

**Total time: ~1.5 hours for fully functional admin system!**

**Ready to implement the complete functional admin system? 🚀**
