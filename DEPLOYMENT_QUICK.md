# 🚀 Quick Deployment Guide - MEDIHUB

## Option 1: Render (Recommended - FREE)

### Step 1: Prepare Repository
Your code is already on GitHub ✅

### Step 2: Sign Up on Render
1. Go to https://render.com
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### Step 3: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `AbhishekS200607/MEDIHUB`
3. Configure:
   - **Name**: `medihub`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Instance Type**: `Free`

### Step 4: Add Environment Variables
Click **"Environment"** and add:

```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"zentra-4268c",...}
SESSION_SECRET=your_random_secret_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_AUTH_MAX=100
RATE_LIMIT_API_MAX=50
NODE_ENV=production
PORT=3000
```

**Get Firebase Service Account:**
1. Go to Firebase Console → Project Settings
2. Service Accounts → Generate New Private Key
3. Copy entire JSON content

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your app will be live at: `https://medihub.onrender.com`

---

## Option 2: Railway (Alternative - FREE)

### Step 1: Sign Up
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Deploy
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select `MEDIHUB` repository
3. Railway auto-detects Node.js

### Step 3: Configure
1. Click on service → **"Variables"**
2. Add same environment variables as Render
3. Set **Start Command**: `cd backend && node server.js`

### Step 4: Deploy
- Railway deploys automatically
- Get URL from dashboard

---

## Option 3: Vercel (Frontend + Serverless)

### For Backend:
Use Render or Railway (Vercel doesn't support long-running Node servers well)

### For Frontend Only:
1. Go to https://vercel.com
2. Import GitHub repository
3. Configure:
   - **Framework**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: Leave empty
   - **Output Directory**: `.`

---

## Option 4: Local Network (Testing)

### Step 1: Get Your Local IP
**Windows:**
```bash
ipconfig
```
Look for `IPv4 Address` (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
```

### Step 2: Update Firebase Config
In `frontend/js/firebase-config.js`, no changes needed (already configured)

### Step 3: Start Server
```bash
cd backend
npm start
```

### Step 4: Access from Other Devices
On same WiFi network, visit:
```
http://YOUR_IP:3000
```
Example: `http://192.168.1.100:3000`

---

## Post-Deployment Checklist

### 1. Update Firebase Settings
1. Go to Firebase Console → Authentication
2. Add your deployment URL to **Authorized domains**:
   - `medihub.onrender.com` (or your domain)

### 2. Test All Features
- ✅ Patient registration
- ✅ Doctor registration with code
- ✅ Admin login
- ✅ Appointment booking
- ✅ Queue management
- ✅ Real-time updates

### 3. Create First Admin
1. Register a normal user
2. Go to Firestore Console
3. Find user in `users` collection
4. Edit document → Change `role` to `"admin"`

### 4. Set Doctor Registration Code
1. Login as admin
2. Go to Settings tab
3. Generate or set custom doctor registration code

---

## Troubleshooting

### "Cannot connect to server"
- Check if backend is running
- Verify environment variables are set
- Check Render/Railway logs

### "Firebase error"
- Verify `FIREBASE_SERVICE_ACCOUNT` is correct JSON
- Check Firebase project is active
- Ensure Firestore rules are deployed

### "Rate limit exceeded"
- Adjust rate limits in environment variables
- Wait 15 minutes for reset

### "Real-time updates not working"
- Deploy Firestore indexes: `firebase deploy --only firestore:indexes`
- Check browser console for errors

---

## Custom Domain (Optional)

### On Render:
1. Go to service → **"Settings"** → **"Custom Domain"**
2. Add your domain (e.g., `medihub.yourdomain.com`)
3. Update DNS records as shown

### On Railway:
1. Click service → **"Settings"** → **"Domains"**
2. Add custom domain
3. Update DNS

---

## Recommended: Render Free Tier

**Pros:**
- ✅ Free forever
- ✅ Auto-deploy from GitHub
- ✅ SSL certificate included
- ✅ Easy environment variables
- ✅ Good for production

**Cons:**
- ⚠️ Spins down after 15 min inactivity (first request takes 30s)
- ⚠️ 750 hours/month limit (enough for 1 app)

**Solution for spin-down:**
Use a free uptime monitor like:
- UptimeRobot (https://uptimerobot.com)
- Ping your app every 14 minutes

---

## Quick Start Commands

```bash
# 1. Ensure code is pushed
git push origin main

# 2. Deploy Firestore rules
firebase deploy --only firestore:rules,firestore:indexes

# 3. Deploy to Render
# (Use web interface - easier than CLI)

# 4. Monitor logs
# Check Render dashboard → Logs tab
```

---

## Support

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **Firebase Docs**: https://firebase.google.com/docs

---

**Estimated Time:** 15-20 minutes
**Cost:** FREE (with limitations)
**Difficulty:** Easy ⭐⭐☆☆☆

Good luck with your deployment! 🚀
