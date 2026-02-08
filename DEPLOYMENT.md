# 🚀 MEDIHUB Deployment Guide

## Deployment Options

### Option 1: Render (Recommended - Free Tier Available)

#### Prerequisites
- GitHub account
- Render account (https://render.com)
- Firebase project configured

#### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Create Web Service on Render**
- Go to https://dashboard.render.com
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Configure:
  - **Name**: medihub
  - **Environment**: Node
  - **Build Command**: `cd backend && npm install`
  - **Start Command**: `cd backend && node server.js`
  - **Instance Type**: Free (or Starter for better performance)

3. **Add Environment Variables**
In Render dashboard, add:
```
FIREBASE_SERVICE_ACCOUNT=<your-firebase-service-account-json>
SESSION_SECRET=<random-secret-key>
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_AUTH_MAX=100
RATE_LIMIT_API_MAX=50
NODE_ENV=production
PORT=3000
```

4. **Deploy**
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Your app will be live at: `https://medihub-xxxx.onrender.com`

---

### Option 2: Heroku

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create App**
```bash
heroku create medihub-app
```

3. **Set Environment Variables**
```bash
heroku config:set FIREBASE_SERVICE_ACCOUNT='<your-json>'
heroku config:set SESSION_SECRET='<random-secret>'
heroku config:set NODE_ENV=production
```

4. **Deploy**
```bash
git push heroku main
```

5. **Open App**
```bash
heroku open
```

---

### Option 3: Vercel

#### Prerequisites
- Vercel account
- Vercel CLI installed

#### Steps

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Create vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend/server.js"
    }
  ]
}
```

3. **Deploy**
```bash
vercel
```

4. **Add Environment Variables**
- Go to Vercel dashboard
- Select your project
- Settings → Environment Variables
- Add all required variables

---

### Option 4: Firebase Hosting + Cloud Functions

#### Prerequisites
- Firebase CLI installed
- Firebase project

#### Steps

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login**
```bash
firebase login
```

3. **Initialize**
```bash
firebase init
```
Select:
- Hosting
- Functions
- Firestore

4. **Move Backend to Functions**
```bash
# Copy backend code to functions folder
# Update functions/index.js to export Express app
```

5. **Deploy**
```bash
firebase deploy
```

---

## Post-Deployment Checklist

### 1. Update Firebase Config
- Update CORS settings in Firebase Console
- Add your deployment URL to authorized domains

### 2. Test All Features
- [ ] User registration
- [ ] Login (Email + Google)
- [ ] Appointment booking
- [ ] Real-time queue updates
- [ ] Doctor dashboard
- [ ] Admin panel

### 3. Security
- [ ] Verify Firestore rules are deployed
- [ ] Check rate limiting is working
- [ ] Test authentication flows
- [ ] Verify HTTPS is enabled

### 4. Performance
- [ ] Enable compression
- [ ] Check response times
- [ ] Monitor error rates
- [ ] Set up logging

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| FIREBASE_SERVICE_ACCOUNT | Firebase admin SDK credentials | `{"type":"service_account",...}` |
| SESSION_SECRET | Secret for session encryption | `random_string_here` |
| PORT | Server port | `3000` |
| NODE_ENV | Environment | `production` |
| RATE_LIMIT_WINDOW_MS | Rate limit window | `900000` (15 min) |
| RATE_LIMIT_MAX | Max requests per window | `100` |
| FRONTEND_URL | Frontend URL for CORS | `https://yourdomain.com` |

---

## Monitoring & Maintenance

### Logs
- **Render**: Dashboard → Logs tab
- **Heroku**: `heroku logs --tail`
- **Vercel**: Dashboard → Deployments → View logs

### Database
- Monitor Firestore usage in Firebase Console
- Set up billing alerts
- Regular backups

### Updates
```bash
# Update dependencies
cd backend
npm update

# Test locally
npm run dev

# Deploy
git push origin main
```

---

## Troubleshooting

### Deployment Fails
- Check build logs
- Verify all dependencies in package.json
- Ensure Node version compatibility

### Firebase Connection Issues
- Verify service account JSON
- Check Firestore rules
- Ensure indexes are created

### Rate Limiting Too Strict
- Adjust limits in environment variables
- Monitor usage patterns
- Consider upgrading plan

### Real-time Updates Not Working
- Check WebSocket support
- Verify Firestore rules
- Check browser console

---

## Scaling Considerations

### Free Tier Limitations
- Render: 750 hours/month, sleeps after inactivity
- Heroku: 550-1000 hours/month
- Vercel: 100GB bandwidth/month

### Upgrade When
- > 1000 daily active users
- Need 24/7 uptime
- Require faster response times
- Need custom domain

### Performance Optimization
- Enable CDN for static files
- Implement caching
- Optimize database queries
- Use connection pooling

---

## Support

For deployment issues:
1. Check logs first
2. Review this guide
3. Check Firebase Console
4. Create GitHub issue

---

**Congratulations!** 🎉 Your MEDIHUB app is now live!
