# 🔧 Firebase Setup Fix Guide

## Issue Identified
Registration hangs with "Loading..." - Firebase Email/Password authentication not enabled.

## Quick Fix (5 minutes)

### Step 1: Enable Email/Password Authentication
1. Go to: https://console.firebase.google.com/project/zentra-4268c/authentication/providers
2. Click **"Email/Password"** in the list
3. Toggle **"Enable"** switch to ON
4. Click **"Save"**

### Step 2: Enable Google Sign-In (Optional)
1. In same page, click **"Google"**
2. Toggle **"Enable"** switch to ON
3. Enter support email
4. Click **"Save"**

### Step 3: Deploy Firestore Rules
1. Go to: https://console.firebase.google.com/project/zentra-4268c/firestore/rules
2. Copy content from `firestore.rules` file
3. Paste into editor
4. Click **"Publish"**

### Step 4: Verify Backend Connection
Check your terminal where `npm run dev` is running. You should see:
```
🏥 MEDIHUB Server running on port 3000
Environment: development
```

If you see errors about Firebase, check `backend/.env` file.

### Step 5: Test Registration Again
1. Go to http://localhost:3000/login
2. Click **"Register now"**
3. Fill in:
   - Name: `Test Patient`
   - Email: `patient@test.com`
   - Password: `test123`
4. Click **"Complete Registration"**
5. ✅ Should redirect to dashboard within 2-3 seconds

---

## Verification Checklist

After enabling authentication, verify:

- [ ] Registration completes within 3 seconds
- [ ] User appears in Firebase Console → Authentication → Users
- [ ] User document created in Firestore → users collection
- [ ] Login works with registered credentials
- [ ] Dashboard loads after login

---

## If Still Having Issues

### Check 1: Backend Logs
Look for these in terminal:
```
✅ Good: "🏥 MEDIHUB Server running on port 3000"
❌ Bad: "Firebase not initialized" or connection errors
```

### Check 2: Browser Console
Press F12, check for:
```
✅ Good: No red errors
❌ Bad: "Firebase: Error (auth/...)" messages
```

### Check 3: Network Tab
In browser DevTools → Network:
```
✅ Good: POST to identitytoolkit.googleapis.com returns 200
❌ Bad: Returns 400 or 403
```

---

## Common Errors & Fixes

### Error: "auth/operation-not-allowed"
**Fix**: Email/Password provider not enabled (see Step 1)

### Error: "auth/invalid-api-key"
**Fix**: Check `frontend/js/firebase-config.js` has correct API key

### Error: "Permission denied" in Firestore
**Fix**: Deploy Firestore rules (see Step 3)

### Registration hangs forever
**Fix**: 
1. Check backend is running (`npm run dev`)
2. Check backend/.env has valid service account JSON
3. Enable Email/Password in Firebase Console

---

## Test After Fix

Run these tests in order:

1. **Register**: patient@test.com / test123
2. **Login**: Use same credentials
3. **Book Appointment**: Select doctor and time
4. **Create Doctor**: Register doctor@test.com, change role in Firestore
5. **Test Queue**: Login as doctor, view queue

---

## Firebase Console Quick Links

- **Authentication**: https://console.firebase.google.com/project/zentra-4268c/authentication/users
- **Firestore**: https://console.firebase.google.com/project/zentra-4268c/firestore/data
- **Rules**: https://console.firebase.google.com/project/zentra-4268c/firestore/rules
- **Settings**: https://console.firebase.google.com/project/zentra-4268c/settings/general

---

## Expected Timeline

After enabling Email/Password:
- Registration: 2-3 seconds
- Login: 1-2 seconds
- API calls: < 500ms
- Real-time updates: < 1 second

---

## Success Indicators

You'll know it's working when:
1. ✅ Registration completes and redirects
2. ✅ User appears in Firebase Console → Authentication
3. ✅ User document in Firestore → users collection
4. ✅ Login works immediately
5. ✅ Dashboard loads with user name

---

**After completing Step 1, refresh the page and try registration again!**
