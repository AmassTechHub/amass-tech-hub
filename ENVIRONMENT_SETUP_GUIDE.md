# 🔧 Environment Variables Setup Guide

## 📧 **EMAIL SERVICE SETUP (Choose One)**

### **Option 1: Resend (Recommended - Easiest)**

1. **Go to [resend.com](https://resend.com)**
2. **Sign up for free account**
3. **Verify your email address**
4. **Go to API Keys section**
5. **Click "Create API Key"**
6. **Copy the API key** (starts with `re_`)
7. **Add to Vercel**: `RESEND_API_KEY=re_your_key_here`

**Free tier**: 3,000 emails/month, 100 emails/day

### **Option 2: SendGrid**

1. **Go to [sendgrid.com](https://sendgrid.com)**
2. **Sign up for free account**
3. **Verify your email address**
4. **Go to Settings → API Keys**
5. **Click "Create API Key"**
6. **Copy the API key**
7. **Add to Vercel**: `SENDGRID_API_KEY=SG.your_key_here`

**Free tier**: 100 emails/day

### **Option 3: Mailgun**

1. **Go to [mailgun.com](https://mailgun.com)**
2. **Sign up for free account**
3. **Verify your email address**
4. **Go to API Security**
5. **Copy the API key**
6. **Add to Vercel**: `MAILGUN_API_KEY=your_key_here`

**Free tier**: 5,000 emails/month for 3 months

---

## 📊 **GOOGLE ANALYTICS SETUP**

### **Step 1: Create Google Analytics Account**
1. **Go to [analytics.google.com](https://analytics.google.com)**
2. **Click "Start measuring"**
3. **Enter property name**: "Amass Tech Hub"
4. **Select "Web"**
5. **Enter website URL**: `https://www.amasstechhub.com`

### **Step 2: Get Measurement ID**
1. **In Google Analytics**, go to **Admin** → **Property Settings**
2. **Copy the "Measurement ID"** (starts with G-)
3. **Add to Vercel**: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`

---

## 🔐 **ADMIN PASSWORD SETUP**

### **Current Password:**
```
ADMIN_PASSWORD=AmassTech2024!
```

### **To Change Password:**
1. **Go to your Vercel dashboard**
2. **Settings** → **Environment Variables**
3. **Edit ADMIN_PASSWORD**
4. **Enter your new secure password**

---

## 🚀 **HOW TO ADD TO VERCEL**

### **Step 1: Go to Vercel Dashboard**
1. **Visit [vercel.com](https://vercel.com)**
2. **Go to your project**
3. **Click "Settings"**
4. **Click "Environment Variables"**

### **Step 2: Add Each Variable**
1. **Click "Add New"**
2. **Enter the variable name** (e.g., `RESEND_API_KEY`)
3. **Enter the value** (your API key)
4. **Select "Production" environment**
5. **Click "Save"**

### **Step 3: Redeploy**
1. **Go to "Deployments" tab**
2. **Click "Redeploy" on latest deployment**
3. **Wait for deployment to complete**

---

## 📋 **COMPLETE ENVIRONMENT VARIABLES LIST**

### **Required Variables:**
```
ADMIN_PASSWORD=AmassTech2024!
RESEND_API_KEY=re_your_key_here
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### **Optional Variables:**
```
DATABASE_URL=your_database_url_here
NEXT_PUBLIC_SITE_URL=https://www.amasstechhub.com
```

---

## 🎯 **QUICK SETUP CHECKLIST**

### **Email Service (5 minutes):**
- [ ] Sign up for Resend/SendGrid/Mailgun
- [ ] Get API key
- [ ] Add to Vercel environment variables

### **Google Analytics (5 minutes):**
- [ ] Create Google Analytics account
- [ ] Get Measurement ID
- [ ] Add to Vercel environment variables

### **Admin Access (1 minute):**
- [ ] Use default password: `AmassTech2024!`
- [ ] Change password in Vercel settings

---

## 🆘 **TROUBLESHOOTING**

### **Email Not Working:**
1. **Check API key** is correct
2. **Verify email service** account is active
3. **Check Vercel logs** for errors

### **Analytics Not Tracking:**
1. **Verify GA ID** starts with G-
2. **Check browser console** for errors
3. **Wait 24 hours** for data to appear

### **Admin Dashboard Not Accessible:**
1. **Check password** is correct
2. **Clear browser cache**
3. **Try incognito mode**

---

## 📞 **SUPPORT**

**Need help?**
- **Resend Support**: [resend.com/docs](https://resend.com/docs)
- **SendGrid Support**: [sendgrid.com/docs](https://sendgrid.com/docs)
- **Google Analytics Help**: [support.google.com/analytics](https://support.google.com/analytics)

**Your Amass Tech Hub will be fully functional once these are set up! 🚀**
