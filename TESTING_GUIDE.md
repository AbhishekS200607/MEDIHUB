# MediHub Testing Guide

## Quick Test Flow

### Step 1: Book an Appointment (as Patient)
1. Login as: patient@test.com / Test123!
2. Go to "Find Doctor"
3. Click "Book Appointment" on any doctor
4. Select Date: Use browser's date picker (click calendar icon)
5. Select Time: Use format HH:MM (e.g., 14:30 or 02:30 PM)
6. Click "Confirm Booking"

### Step 2: View in Live Queue (as Doctor)
1. **IMPORTANT: Open a DIFFERENT browser or Incognito window**
   - Chrome → Patient
   - Firefox/Edge/Incognito → Doctor
2. Login as: doctor@test.com / Test123!
3. Go to "Live Queue"
4. You should see the patient appear instantly (real-time!)

### Step 3: Start Consultation
1. Click "Start Consultation" button
2. Patient's status changes to "in-progress"
3. Go to "Consultation Desk"

### Step 4: Complete Consultation
1. Select the patient from "Active Patients"
2. Enter diagnosis (e.g., "Common cold")
3. Enter prescription (e.g., "Rest and fluids, Paracetamol 500mg")
4. Click "Complete Consultation"

### Step 5: Verify Real-time Updates
1. Switch back to patient window
2. Go to "My Bookings"
3. Status should show "completed" (updates instantly!)

## Date/Time Input Tips

**Date Field:**
- Click the calendar icon in the input field
- Select date from calendar picker
- Or type manually: YYYY-MM-DD (e.g., 2025-02-15)

**Time Field:**
- Click the clock icon
- Select time from picker
- Or type manually: HH:MM (e.g., 14:30 for 2:30 PM)

## Test Accounts

**Patient:**
- Email: patient@test.com
- Password: Test123!

**Doctor:**
- Email: doctor@test.com
- Password: Test123!

## Real-time Features to Test

⚠️ **IMPORTANT: Use different browsers or incognito mode for simultaneous testing**
- Patient: Chrome (normal)
- Doctor: Firefox/Edge OR Chrome Incognito

✅ Appointment appears in doctor's queue instantly
✅ Status changes reflect immediately in patient's bookings
✅ No page refresh needed
✅ Multiple browser windows sync automatically
