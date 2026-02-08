# 🧪 MEDIHUB Testing Guide

## Prerequisites
- Server running: `npm run dev` in backend folder
- Browser open at: http://localhost:3000

---

## Test 1: Patient Registration & Login

### 1.1 Register New Patient
1. Go to http://localhost:3000/login
2. Click **"Register now"**
3. Fill in:
   - Name: `John Patient`
   - Email: `patient@test.com`
   - Password: `test123`
4. Click **"Complete Registration"**
5. ✅ Should redirect to patient dashboard

### 1.2 Login as Patient
1. Go to http://localhost:3000/login
2. Enter:
   - Email: `patient@test.com`
   - Password: `test123`
3. Click **"Login"**
4. ✅ Should see patient dashboard with booking form

---

## Test 2: Book Appointment (Patient)

### 2.1 Create Doctor Account First
1. Register another account:
   - Email: `doctor@test.com`
   - Password: `test123`
   - Name: `Dr. Smith`
2. Go to Firebase Console: https://console.firebase.google.com/project/zentra-4268c/firestore
3. Navigate to `users` collection
4. Find `doctor@test.com` user
5. Edit document → Change `role` from `"patient"` to `"doctor"`
6. Save

### 2.2 Book Appointment
1. Login as `patient@test.com`
2. In **"Book Appointment"** section:
   - Select Doctor: `Dr. Smith`
   - Select Time: `10:00 AM`
3. Click **"Confirm Booking"**
4. ✅ Should see success message with token number
5. ✅ Token should appear in "My Appointments" section

---

## Test 3: Doctor Dashboard

### 3.1 Access Doctor Dashboard
1. Logout (if logged in)
2. Login as `doctor@test.com`
3. Go to http://localhost:3000/doctor
4. ✅ Should see:
   - Current token display
   - Queue controls
   - Patient queue table

### 3.2 Manage Queue
1. ✅ Should see patient in queue with "Waiting" status
2. Click **"Call Next"** or **"Call"** button
3. ✅ Status changes to "Called"
4. ✅ Current token updates
5. Click **"Mark Complete"** or **"Complete"** button
6. ✅ Status changes to "Completed"
7. ✅ Statistics update (Waiting/Completed counts)

---

## Test 4: Real-time Updates

### 4.1 Test Live Queue
1. Open two browser windows:
   - Window 1: Patient dashboard (http://localhost:3000)
   - Window 2: Doctor dashboard (http://localhost:3000/doctor)
2. In Window 1 (Patient): Book appointment
3. ✅ Window 2 (Doctor): Should instantly show new patient in queue
4. In Window 2 (Doctor): Call patient
5. ✅ Window 1 (Patient): Should see token number update

---

## Test 5: Admin Dashboard

### 5.1 Create Admin Account
1. Register: `admin@test.com` / `test123`
2. Go to Firestore Console
3. Change role to `"admin"`

### 5.2 Manage Patients
1. Login as `admin@test.com`
2. Go to http://localhost:3000/admin
3. Click **"+ Add Patient"**
4. Fill in:
   - Name: `Jane Doe`
   - Phone: `+1234567890`
   - Email: `jane@test.com`
5. Click **"Save Patient"**
6. ✅ Patient appears in table
7. Click **"Delete"** to remove
8. ✅ Patient removed from list

---

## Test 6: Security Tests

### 6.1 Role-Based Access
1. Login as `patient@test.com`
2. Try to access http://localhost:3000/doctor
3. ✅ Should show "Access denied" message
4. Try to access http://localhost:3000/admin
5. ✅ Should show "Access denied" message

### 6.2 Authentication Required
1. Logout
2. Try to access http://localhost:3000
3. ✅ Should redirect to /login
4. Try to access http://localhost:3000/doctor
5. ✅ Should redirect to /login

---

## Test 7: Google Sign-In

### 7.1 Enable Google Auth
1. Go to Firebase Console → Authentication
2. Enable Google sign-in provider
3. Add `localhost` to authorized domains

### 7.2 Test Google Login
1. Go to http://localhost:3000/login
2. Click **"Sign in with Google"**
3. Select Google account
4. ✅ Should create account and redirect to dashboard

---

## Test 8: Token System

### 8.1 Daily Token Reset
1. Book multiple appointments (3-4)
2. ✅ Each gets sequential token: #1, #2, #3, #4
3. Complete all appointments
4. Book new appointment next day
5. ✅ Token should reset to #1

### 8.2 Multiple Doctors
1. Create 2 doctor accounts
2. Book appointments with Doctor A
3. Book appointments with Doctor B
4. ✅ Each doctor has separate token sequence

---

## Test 9: Error Handling

### 9.1 Invalid Login
1. Try login with wrong password
2. ✅ Should show error message
3. Try login with non-existent email
4. ✅ Should show error message

### 9.2 Form Validation
1. Try to book appointment without selecting doctor
2. ✅ Should show validation error
3. Try to register with password < 6 characters
4. ✅ Should show validation error

---

## Test 10: Rate Limiting

### 10.1 Test API Limits
1. Open browser console (F12)
2. Run this script:
```javascript
for(let i=0; i<60; i++) {
  fetch('/api/doctors');
}
```
3. ✅ After 50 requests, should get rate limit error

---

## Expected Results Summary

| Test | Expected Result | Status |
|------|----------------|--------|
| Patient Registration | Account created, redirected | ✅ |
| Patient Login | Dashboard loads | ✅ |
| Book Appointment | Token assigned | ✅ |
| Doctor Queue View | Patients visible | ✅ |
| Call Patient | Status updates | ✅ |
| Complete Appointment | Removed from queue | ✅ |
| Real-time Updates | Instant sync | ✅ |
| Admin Patient CRUD | Add/Delete works | ✅ |
| Role-Based Access | Denied for wrong role | ✅ |
| Google Sign-In | Account created | ✅ |

---

## Troubleshooting

### Issue: "Firebase not initialized"
**Fix**: Check `backend/.env` has valid service account JSON

### Issue: "Permission denied" in Firestore
**Fix**: Deploy Firestore rules from `firestore.rules`

### Issue: Real-time updates not working
**Fix**: 
1. Check browser console for errors
2. Verify Firebase config in `frontend/js/firebase-config.js`
3. Create Firestore indexes if prompted

### Issue: Can't access doctor/admin dashboard
**Fix**: Manually change role in Firestore Console

---

## Quick Test Accounts

Create these for quick testing:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| patient@test.com | test123 | patient | Book appointments |
| doctor@test.com | test123 | doctor | Manage queue |
| admin@test.com | test123 | admin | Manage system |

**Remember**: Change roles manually in Firestore after registration!

---

## Performance Benchmarks

- Page load: < 2 seconds
- API response: < 500ms
- Real-time update latency: < 1 second
- Token generation: < 200ms

---

## Test Checklist

- [ ] Patient can register
- [ ] Patient can login
- [ ] Patient can book appointment
- [ ] Patient sees token number
- [ ] Doctor can view queue
- [ ] Doctor can call patient
- [ ] Doctor can complete appointment
- [ ] Admin can add patient
- [ ] Admin can delete patient
- [ ] Real-time updates work
- [ ] Role-based access enforced
- [ ] Google sign-in works
- [ ] Rate limiting active
- [ ] Error messages display
- [ ] Mobile responsive

---

**Testing Complete!** 🎉

For issues, check:
1. Browser console (F12)
2. Server logs (terminal)
3. Firebase Console → Firestore
4. SECURITY.md for security notes
