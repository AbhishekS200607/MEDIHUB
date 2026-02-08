# 🔐 Security Checklist Before GitHub Push

## ✅ What's Safe to Commit
- ✅ Frontend Firebase config (`frontend/js/firebase-config.js`) - Client API keys are public
- ✅ `.env.example` - Template without real credentials
- ✅ All source code files
- ✅ `.gitignore` - Protects sensitive files

## ❌ NEVER Commit These
- ❌ `backend/.env` - Contains Firebase private keys
- ❌ `serviceAccountKey.json` - Firebase admin credentials
- ❌ Any file with `PRIVATE_KEY` or credentials

## 🚀 Setup Instructions for New Deployments

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd MEDIHUB
```

### 2. Create Backend Environment File
```bash
cd backend
cp .env.example .env
```

### 3. Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/select your project
3. Go to **Project Settings > Service Accounts**
4. Click **Generate New Private Key**
5. Copy the entire JSON content
6. Paste into `backend/.env` as `FIREBASE_SERVICE_ACCOUNT` value

### 4. Update Frontend Config
Edit `frontend/js/firebase-config.js` with your Firebase project config:
- Get from Firebase Console > Project Settings > General > Your apps

### 5. Update Hospital Config
Edit `frontend/js/config.js`:
- Hospital name, address, contact info
- Doctor registration code
- Available specializations

### 6. Install & Run
```bash
cd backend
npm install
npm run dev
```

## 🔒 Security Notes

### Firebase Client Keys (Frontend) - SAFE TO EXPOSE ✅
- **Identification, NOT Authorization** - API key only identifies your Firebase project
- **Public by design** - Required for Firebase Client SDK to work
- **Protected by Firestore Security Rules** - Actual permissions controlled server-side
- **No risk** - Cannot delete database or access restricted data with just the API key

### Firebase Admin Keys (Backend) - NEVER EXPOSE ❌
- **Service Account JSON** in `backend/.env` - Full database access
- **Private key** - Grants admin privileges
- Never commit to Git
- Use environment variables only
- Rotate immediately if exposed

### Critical: Firestore Security Rules
Your API key is public, so **anyone can attempt requests**. Security Rules are your defense:

```javascript
// ❌ DANGEROUS - Allows anyone to read/write
allow read, write: if true;

// ✅ SECURE - Only authenticated users access their own data
allow read, write: if request.auth != null && request.auth.uid == userId;
```

**Your current rules** (in `firestore.rules`) are properly locked down with role-based access.

### Verification Before Push
```bash
# Check what will be committed
git status

# Ensure .env is NOT listed
# If it appears, add to .gitignore immediately
```

## 📝 Environment Variables Reference

### Required in `backend/.env`
- `FIREBASE_SERVICE_ACCOUNT` - Firebase admin SDK credentials (JSON)
- `SESSION_SECRET` - Random string for session encryption
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Your frontend URL for CORS

### Optional
- `RATE_LIMIT_*` - API rate limiting configuration
- `NODE_ENV` - development/production

## 🆘 If Credentials Were Exposed

1. **Immediately revoke** the service account key in Firebase Console
2. **Generate new** service account key
3. **Update** `backend/.env` with new credentials
4. **Remove** from Git history:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch backend/.env" \
   --prune-empty --tag-name-filter cat -- --all
   ```
5. **Force push** (if already pushed to remote)

## ✅ Ready to Push Checklist

- [ ] `backend/.env` is in `.gitignore`
- [ ] `backend/.env.example` exists (no real credentials)
- [ ] Run `git status` - `.env` should NOT appear
- [ ] Firebase service account key is NOT in any committed file
- [ ] Firestore Security Rules are properly configured (not `allow read, write: if true`)
- [ ] `SECURITY.md` reviewed
- [ ] All sensitive data replaced with placeholders in examples

## 🛡️ Additional Security Hardening (Recommended)

### 1. Restrict API Key by Domain
Prevent quota abuse by restricting your Firebase API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your Firebase API key (starts with `AIza...`)
3. Click "Edit"
4. Under **Application restrictions**, select **HTTP referrers (web sites)**
5. Add your domains:
   ```
   localhost:*
   your-domain.com/*
   *.your-domain.com/*
   ```
6. Save

Now the key only works from your specified domains.

### 2. Enable Firebase App Check
Verify requests come from your genuine app, not bots:

1. Go to Firebase Console > Build > App Check
2. Register your web app
3. Choose reCAPTCHA v3 or reCAPTCHA Enterprise
4. Add the App Check SDK to your frontend

This prevents automated abuse even with your public API key.

### 3. Monitor Usage
- Set up billing alerts in Google Cloud Console
- Monitor Firebase Usage & Billing dashboard
- Watch for unusual spikes in requests

---

**Remember**: When in doubt, DON'T commit. You can always add files later, but removing sensitive data from Git history is difficult.
