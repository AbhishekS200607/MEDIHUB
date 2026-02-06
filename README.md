# MediHub Enterprise HMS

A real-time Hospital Management System built with React, Firebase, and Tailwind CSS.

## Features

- Role-based access control (Patient, Doctor, Admin)
- Real-time appointment queue updates
- Live consultation management
- Analytics dashboard
- Staff management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create Firestore Database
   - Copy your config to `src/services/firebase.js`

3. Run development server:
```bash
npm run dev
```

## Default Roles

- Patient: Book appointments, view bookings
- Doctor: Manage queue, conduct consultations
- Admin: View analytics, manage staff

## Tech Stack

- React 18
- Firebase v10
- Tailwind CSS
- React Router v6
- Lucide Icons
- date-fns
