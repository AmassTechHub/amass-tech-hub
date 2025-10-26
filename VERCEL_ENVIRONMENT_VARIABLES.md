# 🔧 VERCEL ENVIRONMENT VARIABLES SETUP

## ✅ **YOUR SUPABASE CREDENTIALS**

**Project URL**: `https://oujhimntlngbkescgplt.supabase.co`
**Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91amhpbW50bG5nYmtlc2NncGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MzAyMzQsImV4cCI6MjA3NzAwNjIzNH0.rQDwdEbi1bXR85zudNs_74JQ9J0v-GSb-fhQAAURqZU`
**Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91amhpbW50bG5nYmtlc2NncGx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQzMDIzNCwiZXhwIjoyMDc3MDA2MjM0fQ.iz5DITrHp1CsTYqhdeysMeAYm821CWV2hmUsHf3TiXs`

## 🚀 **ADD TO VERCEL (3 minutes)**

### **Step 1: Go to Vercel Dashboard**
1. **Visit**: https://vercel.com/dashboard
2. **Click on your "amass-tech-hub" project**

### **Step 2: Add Environment Variables**
1. **Click "Settings" tab**
2. **Click "Environment Variables"**
3. **Add these 4 variables one by one:**

#### **Variable 1:**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://oujhimntlngbkescgplt.supabase.co`
- **Environment**: Production

#### **Variable 2:**
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91amhpbW50bG5nYmtlc2NncGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MzAyMzQsImV4cCI6MjA3NzAwNjIzNH0.rQDwdEbi1bXR85zudNs_74JQ9J0v-GSb-fhQAAURqZU`
- **Environment**: Production

#### **Variable 3:**
- **Name**: `SUPABASE_URL`
- **Value**: `https://oujhimntlngbkescgplt.supabase.co`
- **Environment**: Production

#### **Variable 4:**
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91amhpbW50bG5nYmtlc2NncGx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQzMDIzNCwiZXhwIjoyMDc3MDA2MjM0fQ.iz5DITrHp1CsTYqhdeysMeAYm821CWV2hmUsHf3TiXs`
- **Environment**: Production

### **Step 3: Save and Redeploy**
1. **Click "Save" after adding all 4 variables**
2. **Go to "Deployments" tab**
3. **Click "Redeploy" on the latest deployment**
4. **Wait for deployment to complete**

## 🎯 **NEXT: CREATE DATABASE TABLES**

After adding environment variables, you need to:
1. **Go to Supabase dashboard**
2. **Click "SQL Editor"**
3. **Copy and paste the content from `database-setup.sql`**
4. **Click "Run"**

## ✅ **AFTER COMPLETION, YOUR SITE WILL BE:**
- **100% functional** with real database
- **Admin dashboard** with full CRUD operations
- **Real blog posts** (no dummy data)
- **Working contact forms**
- **Newsletter signup** that works
- **Professional blogging platform**

**Ready to add these environment variables to Vercel? 🚀**
