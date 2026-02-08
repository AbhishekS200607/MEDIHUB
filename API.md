# 📡 MEDIHUB API Documentation

Base URL: `http://localhost:3000/api` (Development)

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

---

## 🔐 Authentication Endpoints

### Register User Profile
```http
POST /api/auth/register
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "name": "John Doe",
  "role": "patient",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "uid": "user123",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "patient",
    "phone": "+1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get User Profile
```http
GET /api/auth/profile
```

**Response:**
```json
{
  "user": {
    "uid": "user123",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "patient"
  }
}
```

### Update Profile
```http
PUT /api/auth/profile
```

**Body:**
```json
{
  "name": "John Updated",
  "phone": "+1234567890"
}
```

---

## 📅 Appointment Endpoints

### Book Appointment
```http
POST /api/appointments/book
```

**Required Role:** `patient`

**Body:**
```json
{
  "doctorId": "doctor123",
  "time": "10:00"
}
```

**Response:**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "id": "apt123",
    "userId": "user123",
    "userName": "John Doe",
    "doctorId": "doctor123",
    "tokenNumber": 5,
    "bookingDate": "2024-01-01",
    "time": "10:00",
    "status": "waiting",
    "createdAt": "2024-01-01T09:00:00.000Z"
  }
}
```

### Get Current Token
```http
GET /api/appointments/current-token/:doctorId
```

**Response:**
```json
{
  "currentToken": 5,
  "date": "2024-01-01"
}
```

### Get Queue
```http
GET /api/appointments/queue/:doctorId
```

**Response:**
```json
{
  "queue": [
    {
      "id": "apt123",
      "tokenNumber": 5,
      "userName": "John Doe",
      "time": "10:00",
      "status": "waiting"
    }
  ]
}
```

### Get My Appointments
```http
GET /api/appointments/my-appointments
```

**Response:**
```json
{
  "appointments": [
    {
      "id": "apt123",
      "tokenNumber": 5,
      "doctorId": "doctor123",
      "bookingDate": "2024-01-01",
      "time": "10:00",
      "status": "waiting"
    }
  ]
}
```

### Update Appointment Status
```http
PATCH /api/appointments/:id/status
```

**Required Role:** `doctor` or `admin`

**Body:**
```json
{
  "status": "called"
}
```

**Valid Statuses:** `waiting`, `called`, `completed`, `cancelled`

**Response:**
```json
{
  "message": "Status updated successfully"
}
```

### Get Appointment by ID
```http
GET /api/appointments/:id
```

**Response:**
```json
{
  "appointment": {
    "id": "apt123",
    "userId": "user123",
    "userName": "John Doe",
    "doctorId": "doctor123",
    "tokenNumber": 5,
    "bookingDate": "2024-01-01",
    "time": "10:00",
    "status": "waiting"
  }
}
```

---

## 👥 Patient Endpoints

### Create Patient
```http
POST /api/patients
```

**Required Role:** `admin` or `doctor`

**Body:**
```json
{
  "name": "Jane Smith",
  "phone": "+1234567890",
  "email": "jane@example.com",
  "address": "123 Main St",
  "medicalHistory": "No known allergies"
}
```

**Response:**
```json
{
  "message": "Patient created successfully",
  "patient": {
    "id": "patient123",
    "name": "Jane Smith",
    "phone": "+1234567890",
    "email": "jane@example.com",
    "address": "123 Main St",
    "medicalHistory": "No known allergies",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Patients
```http
GET /api/patients?limit=50&startAfter=patient123
```

**Required Role:** `admin` or `doctor`

**Query Parameters:**
- `limit` (optional): Number of patients to return (default: 50)
- `startAfter` (optional): Patient ID to start after (pagination)

**Response:**
```json
{
  "patients": [
    {
      "id": "patient123",
      "name": "Jane Smith",
      "phone": "+1234567890",
      "email": "jane@example.com"
    }
  ],
  "count": 1
}
```

### Search Patients
```http
GET /api/patients/search?q=Jane
```

**Required Role:** `admin` or `doctor`

**Response:**
```json
{
  "patients": [
    {
      "id": "patient123",
      "name": "Jane Smith",
      "phone": "+1234567890"
    }
  ]
}
```

### Get Patient by ID
```http
GET /api/patients/:id
```

**Required Role:** `admin` or `doctor`

**Response:**
```json
{
  "patient": {
    "id": "patient123",
    "name": "Jane Smith",
    "phone": "+1234567890",
    "email": "jane@example.com",
    "address": "123 Main St",
    "medicalHistory": "No known allergies"
  }
}
```

### Update Patient
```http
PUT /api/patients/:id
```

**Required Role:** `admin` or `doctor`

**Body:**
```json
{
  "name": "Jane Updated",
  "phone": "+1234567890",
  "email": "jane.updated@example.com"
}
```

**Response:**
```json
{
  "message": "Patient updated successfully"
}
```

### Delete Patient
```http
DELETE /api/patients/:id
```

**Required Role:** `admin`

**Response:**
```json
{
  "message": "Patient deleted successfully"
}
```

---

## 👨‍⚕️ Doctor Endpoints

### Get All Doctors
```http
GET /api/doctors
```

**No authentication required**

**Response:**
```json
{
  "doctors": [
    {
      "id": "doctor123",
      "name": "Dr. Smith",
      "email": "dr.smith@example.com",
      "role": "doctor"
    }
  ]
}
```

### Get Doctor Schedule
```http
GET /api/doctors/:id/schedule
```

**Response:**
```json
{
  "schedule": [
    {
      "id": "apt123",
      "tokenNumber": 5,
      "userName": "John Doe",
      "time": "10:00",
      "status": "waiting"
    }
  ],
  "date": "2024-01-01"
}
```

### Get Doctor Statistics
```http
GET /api/doctors/:id/stats
```

**Required Role:** `doctor` or `admin`

**Response:**
```json
{
  "stats": {
    "totalToday": 10,
    "completed": 5,
    "waiting": 3,
    "date": "2024-01-01"
  }
}
```

---

## 🔒 Rate Limiting

### Auth Endpoints
- **Window:** 15 minutes
- **Max Requests:** 100
- **Applies to:** `/api/auth/*`

### API Endpoints
- **Window:** 1 hour
- **Max Requests:** 50
- **Applies to:** All other `/api/*` endpoints

### Response Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### Rate Limit Exceeded Response
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","role":"patient"}'
```

### Book Appointment
```bash
curl -X POST http://localhost:3000/api/appointments/book \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doctorId":"doctor123","time":"10:00"}'
```

### Get Current Token
```bash
curl http://localhost:3000/api/appointments/current-token/doctor123
```

---

## 📊 Real-time Updates

The application uses Firestore real-time listeners for:

### Queue Updates
```javascript
// Frontend code
listenToQueue(doctorId, (queue) => {
  // Queue updated in real-time
});
```

### Current Token Updates
```javascript
// Frontend code
listenToCurrentToken(doctorId, (token) => {
  // Token updated in real-time
});
```

---

## 🔑 User Roles

| Role | Permissions |
|------|-------------|
| `patient` | Book appointments, view own appointments |
| `doctor` | View queue, update appointment status, manage patients |
| `admin` | Full access to all features |

---

## 📝 Notes

1. All timestamps are in ISO 8601 format
2. Token numbers reset daily at midnight
3. Appointments are automatically ordered by token number
4. Real-time updates use Firestore listeners (no polling)
5. All endpoints return JSON

---

## 🛠️ Development Tools

### Postman Collection
Import this collection for easy testing:
```json
{
  "info": {
    "name": "MEDIHUB API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/register"
          }
        }
      ]
    }
  ]
}
```

### Environment Variables
```
baseUrl=http://localhost:3000
token=YOUR_FIREBASE_TOKEN
```

---

For more information, see README.md
