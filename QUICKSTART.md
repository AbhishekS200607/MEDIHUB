# MEDIHUB Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Firebase

1. **Get Firebase Service Account**:
   - Go to https://console.firebase.google.com/
   - Select your project: `zentra-4268c`
   - Go to Project Settings (⚙️) > Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file

2. **Update backend/.env**:
   - Open `backend/.env`
   - Replace the `FIREBASE_SERVICE_ACCOUNT` value with your downloaded JSON (as a single line)

3. **Enable Firebase Services**:
   - Enable Authentication (Email/Password + Google)
   - Create Firestore Database (production mode)
   - Deploy Firestore rules from `firestore.rules`

### Step 3: Run the Application
```bash
cd backend
npm run dev
```

Visit: http://localhost:3000

### Step 4: Create Test Users

1. **Register as Patient**:
   - Go to http://localhost:3000/login
   - Click "Register" tab
   - Create an account

2. **Create Doctor Account**:
   - Register another account
   - Go to Firestore Console
   - Find the user in `users` collection
   - Change `role` field to `"doctor"`

3. **Create Admin Account**:
   - Register another account
   - Change `role` field to `"admin"` in Firestore

### Step 5: Test the System

**As Patient** (http://localhost:3000):
- Book an appointment
- View your token number
- Check queue status

**As Doctor** (http://localhost:3000/doctor):
- View live queue
- Call patients
- Mark appointments complete

**As Admin** (http://localhost:3000/admin):
- Add/manage patients
- View reports
- System analytics

## 📝 Important Notes

1. **Firebase Config**: Your Firebase config is already in `frontend/js/firebase-config.js`
2. **Service Account**: Must be valid JSON from Firebase Console
3. **Firestore Rules**: Deploy rules using Firebase CLI or Console
4. **Indexes**: Firestore will prompt to create indexes when needed

## 🐛 Common Issues

**"Firebase not initialized"**
- Check service account JSON in `.env`
- Ensure it's valid JSON (no line breaks)

**"Permission denied"**
- Deploy Firestore rules from `firestore.rules`
- Check user role in Firestore

**"Rate limit exceeded"**
- Wait 15 minutes or adjust limits in `.env`

## 📚 Next Steps

- Read full README.md for deployment
- Customize styles in `frontend/css/style.css`
- Add more features as needed

## 🎯 Default Credentials

No default credentials - you create your own accounts!

## 💡 Tips

- Use Chrome DevTools for debugging
- Check browser console for errors
- Monitor Firestore in Firebase Console
- Use Incognito mode to test different roles

---

Need help? Check README.md or create an issue!
