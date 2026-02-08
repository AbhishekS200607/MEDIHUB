# 🎯 MEDIHUB - Complete Installation & Usage Guide

## 🚀 Quick Start (5 Minutes)

### Option 1: Automated Setup (Windows)
```bash
# Double-click setup.bat
# OR run in terminal:
setup.bat
```

### Option 2: Manual Setup
```bash
# Install dependencies
cd backend
npm install

# Configure environment
# Edit backend/.env with your Firebase credentials

# Start server
npm run dev
```

Visit: http://localhost:3000

---

## 📋 Detailed Installation

### Step 1: Prerequisites

Install these before starting:

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **Git** (optional, for version control)
   - Download: https://git-scm.com/
   - Verify: `git --version`

3. **Firebase Account**
   - Sign up: https://console.firebase.google.com/

### Step 2: Firebase Project Setup

#### 2.1 Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: "MEDIHUB" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

#### 2.2 Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password"
4. Enable "Google" sign-in
5. Add authorized domain: `localhost` (for development)

#### 2.3 Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose location (closest to your users)
5. Click "Enable"

#### 2.4 Deploy Firestore Rules
1. In Firestore Console, go to "Rules" tab
2. Copy content from `firestore.rules`
3. Paste and click "Publish"

#### 2.5 Get Service Account Key
1. Go to Project Settings (⚙️ icon)
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Save the JSON file securely
5. **IMPORTANT**: Never commit this file to Git!

#### 2.6 Get Web App Config
1. In Project Settings, scroll to "Your apps"
2. Click "Web" icon (</>) to add web app
3. Register app with nickname: "MEDIHUB Web"
4. Copy the firebaseConfig object
5. You'll use this in Step 3

### Step 3: Configure Application

#### 3.1 Backend Configuration

Create/Edit `backend/.env`:

```env
# Paste your service account JSON (entire content, single line)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}

# Generate a random secret (use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET=your_random_secret_here

# Server settings
PORT=3000
NODE_ENV=development

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_AUTH_MAX=100
RATE_LIMIT_API_MAX=50
```

**How to format service account JSON:**
```bash
# Remove all line breaks and make it a single line
# Example:
{"type":"service_account","project_id":"medihub-123",...}
```

#### 3.2 Frontend Configuration

Edit `frontend/js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // optional
};
```

### Step 4: Install Dependencies

```bash
# Navigate to backend folder
cd backend

# Install all dependencies
npm install

# Expected output:
# added 150+ packages in 30s
```

### Step 5: Start the Application

```bash
# Development mode (auto-reload on changes)
npm run dev

# Production mode
npm start
```

**Expected output:**
```
🏥 MEDIHUB Server running on port 3000
Environment: development
```

### Step 6: Access the Application

Open your browser and visit:
- **Patient Dashboard**: http://localhost:3000
- **Login Page**: http://localhost:3000/login
- **Doctor Dashboard**: http://localhost:3000/doctor
- **Admin Panel**: http://localhost:3000/admin

---

## 👥 Creating Test Users

### Method 1: Via Web Interface

1. **Create Patient Account**:
   - Go to http://localhost:3000/login
   - Click "Register" tab
   - Fill in details:
     - Name: John Doe
     - Email: patient@test.com
     - Password: test123
   - Click "Register"

2. **Create Doctor Account**:
   - Register another user: doctor@test.com
   - Go to Firebase Console → Firestore
   - Find the user in `users` collection
   - Edit the document
   - Change `role` field from `"patient"` to `"doctor"`
   - Save

3. **Create Admin Account**:
   - Register another user: admin@test.com
   - Change `role` to `"admin"` in Firestore

### Method 2: Via Firestore Console

1. Go to Firestore Console
2. Click "Start collection"
3. Collection ID: `users`
4. Document ID: (auto-generated)
5. Add fields:
   ```
   uid: "user123"
   email: "test@example.com"
   name: "Test User"
   role: "patient" (or "doctor" or "admin")
   phone: "+1234567890"
   createdAt: (timestamp)
   ```

---

## 🎮 Using the Application

### As Patient

1. **Login**:
   - Go to http://localhost:3000/login
   - Enter credentials
   - Click "Login"

2. **Book Appointment**:
   - Select doctor from dropdown
   - Choose time slot
   - Click "Book Appointment"
   - Note your token number

3. **View Queue**:
   - Select doctor in "Current Token" section
   - See real-time current token
   - Check your position

4. **View History**:
   - Scroll to "My Appointments"
   - See all your bookings
   - Check status

### As Doctor

1. **Login**:
   - Go to http://localhost:3000/login
   - Login with doctor account
   - Automatically redirected to doctor dashboard

2. **View Queue**:
   - See all patients in queue
   - View token numbers
   - Check appointment times

3. **Call Patient**:
   - Click "Call" button next to patient
   - Status changes to "called"
   - Patient sees update in real-time

4. **Complete Appointment**:
   - Click "Complete" button
   - Status changes to "completed"
   - Patient removed from active queue

5. **View Statistics**:
   - See total appointments today
   - Check waiting count
   - View completed count

### As Admin

1. **Login**:
   - Go to http://localhost:3000/login
   - Login with admin account

2. **Manage Patients**:
   - Click "Patients" tab
   - View all patients
   - Search by name
   - Add new patient
   - Edit/Delete patients

3. **Add Patient**:
   - Click "+ Add Patient"
   - Fill in details:
     - Name
     - Phone (required)
     - Email
     - Address
     - Medical History
   - Click "Save Patient"

4. **View Reports**:
   - Click "Reports" tab
   - See today's statistics
   - View system overview
   - Check total patients/doctors

---

## 🧪 Testing Scenarios

### Scenario 1: Complete Patient Journey

1. Register as patient
2. Book appointment with Doctor A at 10:00 AM
3. Receive token #1
4. View current token (should show 0 initially)
5. Doctor calls you (token becomes 1)
6. Doctor completes appointment
7. Check appointment history (status: completed)

### Scenario 2: Doctor Workflow

1. Login as doctor
2. View empty queue
3. Patient books appointment
4. See patient appear in queue (real-time)
5. Call patient
6. Complete appointment
7. View updated statistics

### Scenario 3: Multiple Patients

1. Patient A books at 10:00 (Token #1)
2. Patient B books at 10:30 (Token #2)
3. Patient C books at 11:00 (Token #3)
4. Doctor sees all 3 in queue
5. Doctor calls Token #1
6. Current token updates to 1
7. All patients see update
8. Doctor completes Token #1
9. Doctor calls Token #2
10. Process continues

### Scenario 4: Admin Operations

1. Login as admin
2. Add new patient record
3. Search for patient
4. Update patient information
5. View system reports
6. Check daily statistics

---

## 🔧 Troubleshooting

### Issue: "Firebase not initialized"

**Solution:**
```bash
# Check backend/.env file
# Ensure FIREBASE_SERVICE_ACCOUNT is valid JSON
# No line breaks in the JSON string
```

### Issue: "Permission denied" in Firestore

**Solution:**
1. Go to Firestore Console
2. Click "Rules" tab
3. Copy content from `firestore.rules`
4. Click "Publish"

### Issue: "Rate limit exceeded"

**Solution:**
```bash
# Wait 15 minutes
# OR adjust limits in backend/.env:
RATE_LIMIT_MAX=200
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Change port in backend/.env:
PORT=3001

# OR kill process using port 3000:
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### Issue: Real-time updates not working

**Solution:**
1. Check browser console for errors
2. Verify Firebase config in `frontend/js/firebase-config.js`
3. Ensure Firestore indexes are created
4. Check network tab for WebSocket connections

### Issue: Google Sign-in not working

**Solution:**
1. Go to Firebase Console → Authentication
2. Enable Google provider
3. Add authorized domain: `localhost`
4. For production, add your domain

---

## 📊 Monitoring & Logs

### View Server Logs

```bash
# Development mode (auto-logs)
npm run dev

# Production mode with logs
npm start | tee server.log
```

### Check Firestore Usage

1. Go to Firebase Console
2. Click "Usage" tab
3. Monitor:
   - Document reads
   - Document writes
   - Storage usage
   - Network egress

### Monitor Authentication

1. Go to Firebase Console → Authentication
2. Click "Users" tab
3. See all registered users
4. Check sign-in methods

---

## 🔒 Security Checklist

Before going to production:

- [ ] Change SESSION_SECRET to random string
- [ ] Update Firestore rules
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Remove console.log statements
- [ ] Set NODE_ENV=production
- [ ] Enable Firebase App Check
- [ ] Set up monitoring
- [ ] Configure backups

---

## 📈 Performance Tips

1. **Enable Compression**:
   - Already enabled in server.js
   - Reduces response size by 70%

2. **Use CDN**:
   - Bootstrap loaded from CDN
   - Firebase SDK from CDN

3. **Optimize Queries**:
   - Use indexes (firestore.indexes.json)
   - Limit query results
   - Use pagination

4. **Cache Static Files**:
   - Configure in server.js
   - Set appropriate cache headers

---

## 🎓 Learning Resources

### Understanding the Code

1. **Backend Structure**:
   - `server.js` - Main Express server
   - `routes/` - API endpoints
   - `middleware/` - Auth & rate limiting
   - `models/` - Database helpers

2. **Frontend Structure**:
   - `*.html` - Page templates
   - `js/` - JavaScript modules
   - `css/` - Custom styles

3. **Key Concepts**:
   - Real-time listeners (Firestore)
   - JWT authentication
   - Rate limiting
   - Role-based access

### Next Steps

1. Customize UI/UX
2. Add more features
3. Deploy to production
4. Set up monitoring
5. Add tests
6. Optimize performance

---

## 📞 Getting Help

### Documentation
- README.md - Main documentation
- API.md - API reference
- DEPLOYMENT.md - Deployment guide
- SUMMARY.md - Project overview

### Support Channels
1. Check documentation first
2. Search existing issues
3. Create new issue on GitHub
4. Contact maintainers

---

## ✅ Success Checklist

After installation, verify:

- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can register new user
- [ ] Can login with email/password
- [ ] Can book appointment
- [ ] Token number generated
- [ ] Real-time updates working
- [ ] Doctor dashboard accessible
- [ ] Admin panel accessible
- [ ] All CRUD operations work

---

**Congratulations! 🎉**

Your MEDIHUB application is now fully installed and ready to use!

For deployment instructions, see DEPLOYMENT.md
For API documentation, see API.md

---

Version: 1.0.0
Last Updated: 2024
