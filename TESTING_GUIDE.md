# 🧪 MEDIHUB Testing Guide

Complete testing workflow for all user roles and features.

## 📋 Prerequisites

- Backend server running on `http://localhost:3000`
- Firebase project configured
- At least one admin user created in Firestore

---

## 🔐 1. Authentication Testing

### Patient Registration
1. Navigate to `/login.html`
2. Click "Register" tab
3. Fill in:
   - Name: `Test Patient`
   - Email: `patient@test.com`
   - Password: `test123`
4. Click "Register"
5. ✅ Should redirect to `/` (patient dashboard)

### Doctor Registration
1. Navigate to `/doctor-register.html`
2. Fill in:
   - Name: `Dr. Smith`
   - Email: `doctor@test.com`
   - Password: `test123`
   - Specialization: `Cardiology`
   - Registration Code: (get from admin panel)
3. Click "Register"
4. ✅ Should redirect to `/doctor.html`

### Admin Login
1. Navigate to `/login.html`
2. Login with admin credentials
3. ✅ Should redirect to `/admin.html`

### Google OAuth (Optional)
1. Click "Continue with Google"
2. Select Google account
3. ✅ Should create profile and redirect based on role

---

## 👤 2. Patient Dashboard Testing

### Book Appointment
1. Login as patient
2. On dashboard, click "Book Appointment"
3. Select doctor from dropdown
4. Click "Book Appointment"
5. ✅ Should show success message with token number
6. ✅ Token should appear in "Your Appointments" section

### View Queue Status
1. Check "Current Queue Status" section
2. ✅ Should show current token being served
3. ✅ Should show your position in queue

### View Appointment History
1. Scroll to "Your Appointments"
2. ✅ Should list all appointments with:
   - Token number
   - Doctor name
   - Date
   - Status (Waiting/Called/Completed)

---

## 👨‍⚕️ 3. Doctor Dashboard Testing

### View Live Queue
1. Login as doctor
2. Check "Today's Queue" section
3. ✅ Should show all waiting appointments
4. ✅ Should display patient names and token numbers

### Call Next Patient
1. Click "Call Next" button
2. ✅ Current token should increment
3. ✅ Patient status should change to "Called"
4. ✅ Real-time update should reflect on patient dashboard

### Mark Appointment Complete
1. Click "Complete" on an appointment
2. ✅ Status should change to "Completed"
3. ✅ Appointment should move to completed section

### View Statistics
1. Check stats cards at top
2. ✅ Should show:
   - Total appointments today
   - Completed count
   - Waiting count

---

## 👨‍💼 4. Admin Panel Testing

### Dashboard Overview
1. Login as admin
2. Navigate to `/admin.html`
3. ✅ Should show stats cards:
   - Total Appointments (today)
   - Total Patients (registered users + patient records)
   - Total Doctors

### Patient Management
1. Click "Patients" tab
2. **Add Patient:**
   - Click "+ Add Patient"
   - Fill: Name, Phone, Email, Address
   - Click "Save"
   - ✅ Should appear in table
3. **Search Patient:**
   - Type in search box
   - ✅ Should filter results
4. **Delete Patient:**
   - Click "Delete" on a patient
   - Confirm deletion
   - ✅ Should remove from list

### Doctor Management
1. Click "Doctors" tab
2. ✅ Should list all registered doctors
3. **Restrict Doctor:**
   - Click "Restrict" on active doctor
   - ✅ Status should change to "Restricted"
   - ✅ Doctor should get 403 error on login
4. **Activate Doctor:**
   - Click "Activate" on restricted doctor
   - ✅ Status should change to "Active"
5. **Delete Doctor:**
   - Click "Delete"
   - Confirm deletion
   - ✅ Doctor and their appointments should be deleted

### Settings - Hospital Configuration
1. Click "Settings" tab
2. Fill hospital information:
   - Hospital Name: `City General Hospital`
   - Address: `123 Main St, City`
   - Phone: `+1 234 567 8900`
   - Email: `info@hospital.com`
3. Click "Save Hospital Info"
4. ✅ Should show success message
5. Refresh page
6. ✅ Data should persist

### Settings - Doctor Registration Code
1. In Settings tab, scroll to "Doctor Registration Settings"
2. **View Code:**
   - Click eye icon (👁️)
   - ✅ Should reveal code
3. **Generate Random Code:**
   - Click "🔄 Generate Random"
   - Confirm
   - ✅ Should generate new 10-character code
4. **Set Custom Code:**
   - Click "✏️ Set Custom"
   - Enter code (min 6 chars): `MEDIHUB2024`
   - Click "Save"
   - ✅ Should update code
5. **Test Code:**
   - Try registering doctor with old code
   - ✅ Should fail
   - Try with new code
   - ✅ Should succeed

---

## 🔄 5. Real-time Updates Testing

### Queue Updates
1. Open patient dashboard in one browser
2. Open doctor dashboard in another browser
3. Doctor calls next patient
4. ✅ Patient dashboard should update immediately
5. ✅ Current token should change in real-time

### Appointment Status
1. Patient books appointment
2. ✅ Should appear in doctor's queue instantly
3. Doctor completes appointment
4. ✅ Patient should see status change to "Completed"

---

## 🔒 6. Security Testing

### Rate Limiting
1. Make 100+ requests to `/api/auth/login` within 15 minutes
2. ✅ Should return 429 (Too Many Requests)

### Token Expiration
1. Login and wait 1 hour
2. Try to make API call
3. ✅ Should return 403 (Forbidden)
4. Refresh page
5. ✅ Should redirect to login

### Role-Based Access
1. Login as patient
2. Try accessing `/admin.html`
3. ✅ Should show "Access denied" error
4. Try accessing `/api/admin/doctors` directly
5. ✅ Should return 403

### Restricted Doctor
1. Admin restricts a doctor
2. Doctor tries to login
3. ✅ Should login successfully
4. Doctor tries to access appointments
5. ✅ Should get "Account restricted" error

---

## 📱 7. Responsive Design Testing

### Mobile View (< 768px)
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. Test all pages:
   - ✅ Navigation should be mobile-friendly
   - ✅ Tables should scroll horizontally
   - ✅ Buttons should be touch-friendly
   - ✅ Forms should be easy to fill

### Tablet View (768px - 1024px)
1. Select "iPad"
2. ✅ Layout should adapt properly
3. ✅ Stats cards should stack appropriately

---

## 🐛 8. Error Handling Testing

### Network Errors
1. Stop backend server
2. Try booking appointment
3. ✅ Should show error toast
4. ✅ Should not crash application

### Invalid Input
1. Try registering with invalid email
2. ✅ Should show validation error
3. Try booking without selecting doctor
4. ✅ Should prevent submission

### Expired Token
1. Manually delete token from localStorage
2. Try accessing protected page
3. ✅ Should redirect to login

---

## ✅ 9. Complete User Flow Test

### Scenario: Patient Books and Completes Appointment

1. **Patient Registration:**
   - Register as `john@test.com`
   - ✅ Redirects to dashboard

2. **Book Appointment:**
   - Select "Dr. Smith - Cardiology"
   - Click "Book Appointment"
   - ✅ Receives token #1

3. **Doctor Login:**
   - Login as `doctor@test.com`
   - ✅ Sees John in queue

4. **Call Patient:**
   - Click "Call Next"
   - ✅ Token #1 is called
   - ✅ John sees status change to "Called"

5. **Complete Appointment:**
   - Click "Complete"
   - ✅ Status changes to "Completed"
   - ✅ Moves to completed section

6. **Admin Verification:**
   - Login as admin
   - ✅ Dashboard shows 1 appointment today
   - ✅ Patient count includes John

---

## 📊 10. Performance Testing

### Load Time
1. Open DevTools Network tab
2. Refresh page
3. ✅ Initial load should be < 2 seconds
4. ✅ API calls should be < 500ms

### Real-time Performance
1. Create 10+ appointments
2. ✅ Queue updates should be instant
3. ✅ No lag in UI updates

---

## 🔍 11. Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## 📝 Test Checklist

### Authentication
- [ ] Patient registration works
- [ ] Doctor registration with code works
- [ ] Admin login redirects correctly
- [ ] Google OAuth works
- [ ] Logout clears session

### Patient Features
- [ ] Book appointment
- [ ] View queue status
- [ ] View appointment history
- [ ] Real-time updates work

### Doctor Features
- [ ] View live queue
- [ ] Call next patient
- [ ] Complete appointment
- [ ] Statistics accurate

### Admin Features
- [ ] Dashboard stats correct
- [ ] Add/delete patients
- [ ] Manage doctors (restrict/activate/delete)
- [ ] Update hospital config
- [ ] Manage doctor registration code

### Security
- [ ] Rate limiting works
- [ ] Token expiration handled
- [ ] Role-based access enforced
- [ ] Restricted doctors blocked

### UI/UX
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Error messages clear
- [ ] Loading states shown
- [ ] Success toasts appear

---

## 🚨 Common Issues & Solutions

### Issue: "No Firebase App created"
**Solution:** Ensure Firebase is initialized before making calls

### Issue: 403 Forbidden on API calls
**Solution:** Token expired, logout and login again

### Issue: Doctor registration fails
**Solution:** Verify registration code in admin panel

### Issue: Real-time updates not working
**Solution:** Check Firestore indexes are enabled

### Issue: Patient count shows 0
**Solution:** Ensure users collection has role="patient" entries

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify backend server is running
3. Check Firestore rules are deployed
4. Review this testing guide

---

**Last Updated:** 2024
**Version:** 1.0
