# 🏥 MEDIHUB - Hospital Management System

A complete, production-ready hospital management web application with real-time appointment booking, queue management, and patient records.

## 🚀 Features

### Core Functionality
- **Authentication**: Email/Password + Google OAuth with role-based access (Patient, Doctor, Admin)
- **Appointment Booking**: Real-time token generation with daily auto-reset
- **Queue Management**: Live queue updates with current token display
- **Patient Management**: Complete CRUD operations for patient records
- **Doctor Dashboard**: Live queue monitoring and appointment management
- **Admin Panel**: Patient management, reports, and system analytics

### Technical Features
- ✅ Rate limiting (100 req/15min for auth, 50/hour for API)
- ✅ Real-time updates using Firestore listeners
- ✅ Secure authentication with Firebase Auth
- ✅ Responsive design (mobile-first)
- ✅ Input validation (client & server)
- ✅ Error handling & loading states
- ✅ Production-ready security (Helmet, CORS)
- ✅ Compression & performance optimization

## 📁 Project Structure

```
MEDIHUB/
├── backend/
│   ├── server.js              # Express server
│   ├── middleware/
│   │   ├── auth.js           # Firebase auth verification
│   │   └── rateLimit.js      # Rate limiting
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── appointments.js   # Appointment management
│   │   ├── patients.js       # Patient CRUD
│   │   └── doctors.js        # Doctor operations
│   ├── models/
│   │   └── firebase.js       # Firestore helpers
│   └── package.json
├── frontend/
│   ├── index.html            # Patient dashboard
│   ├── doctor.html           # Doctor interface
│   ├── admin.html            # Admin panel
│   ├── login.html            # Authentication
│   ├── css/
│   │   └── style.css         # Custom styles
│   └── js/
│       ├── firebase-config.js
│       ├── auth.js
│       ├── appointments.js
│       └── utils.js
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5, Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **Hosting**: Render-ready

## 📋 Prerequisites

- Node.js (v16 or higher)
- Firebase account
- Git

## 🔧 Local Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd MEDIHUB
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Email/Password + Google)
4. Create a **Firestore Database** (Start in production mode)
5. Generate a **Service Account Key**:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file

### 3. Configure Environment Variables

Create `backend/.env` file:

```env
# Firebase Service Account (paste the entire JSON)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"..."}

# Server Config
PORT=3000
SESSION_SECRET=your_random_secret_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_AUTH_MAX=100
RATE_LIMIT_API_MAX=50

NODE_ENV=development
```

### 4. Update Firebase Config

Edit `frontend/js/firebase-config.js` with your Firebase project config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Install Dependencies

```bash
cd backend
npm install
```

### 6. Run the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Visit: `http://localhost:3000`

## 🌐 Deployment to Render

### 1. Prepare for Deployment

Ensure these files exist:
- `Procfile` (already created)
- `backend/package.json` with start script

### 2. Deploy to Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: medihub
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Instance Type**: Free or Starter

### 3. Add Environment Variables

In Render dashboard, add these environment variables:

```
FIREBASE_SERVICE_ACCOUNT=<your-service-account-json>
SESSION_SECRET=<random-secret>
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_AUTH_MAX=100
RATE_LIMIT_API_MAX=50
NODE_ENV=production
```

### 4. Deploy

Click "Create Web Service" and wait for deployment to complete.

## 📊 Firestore Structure

```
users/{uid}
  - email: string
  - name: string
  - role: "patient" | "doctor" | "admin"
  - phone: string
  - createdAt: timestamp

appointments/{id}
  - userId: string
  - userName: string
  - doctorId: string
  - tokenNumber: number
  - bookingDate: string (YYYY-MM-DD)
  - time: string
  - status: "waiting" | "called" | "completed" | "cancelled"
  - createdAt: timestamp

patients/{id}
  - name: string
  - phone: string
  - email: string
  - address: string
  - medicalHistory: string
  - appointments: array
  - createdAt: timestamp

tokens/{doctorId_date}
  - current: number
  - date: string
  - doctorId: string
```

## 🔐 Security Features

- Firebase Authentication with JWT tokens
- Rate limiting on all endpoints
- Helmet.js for security headers
- CORS configuration
- Input validation
- Role-based access control
- Secure environment variables

## 🎯 User Roles

### Patient
- Book appointments
- View queue status
- See appointment history

### Doctor
- View live queue
- Call patients
- Mark appointments complete
- View daily statistics

### Admin
- Manage patients (CRUD)
- View system reports
- Access all features

## 📱 Responsive Design

- Mobile-first approach
- Bootstrap 5 responsive grid
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🧪 Testing

### Create Test Users

1. Register via `/login` page
2. Manually update role in Firestore:
   - Go to Firestore Console
   - Navigate to `users` collection
   - Edit user document
   - Change `role` field to `doctor` or `admin`

### Test Workflow

1. **Patient**: Book appointment → Get token number
2. **Doctor**: View queue → Call patient → Complete
3. **Admin**: Add patient → View reports

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify service account JSON is correct
- Check Firestore rules allow read/write
- Ensure Authentication is enabled

### Rate Limiting Errors
- Adjust limits in `.env`
- Clear browser cache
- Wait for rate limit window to reset

### Real-time Updates Not Working
- Check Firestore indexes
- Verify Firebase config in frontend
- Check browser console for errors

## 📈 Future Enhancements

- [ ] Email notifications
- [ ] SMS alerts for appointments
- [ ] Payment integration
- [ ] Medical records upload
- [ ] Video consultation
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] PWA features

## 📄 License

MIT License - feel free to use for your projects!

## 👨‍💻 Author

Built with ❤️ for modern healthcare management

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Bootstrap for UI components
- Express.js community

---

**Note**: This is a production-ready application. Ensure you follow security best practices and keep dependencies updated.

For issues or questions, please open a GitHub issue.
