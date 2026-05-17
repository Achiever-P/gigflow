# GigFlow API Documentation

This document outlines the backend API endpoints for the GigFlow Smart Leads Dashboard. The API is RESTful and uses JSON for request and response payloads.

---

## Authentication Endpoints

All responses containing user data will exclude the password hash.

### 1. Register User
Create a new user account (Admin or Sales User).

- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Headers**: `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "Admin" // "Admin" | "Sales User"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "Admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login User
Authenticate an existing user.

- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Headers**: `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "Admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get Current User Profile
Retrieve the authenticated user's profile.

- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "Admin"
}
```

---

## Leads Endpoints

### 1. Get All Leads (with Pagination & Filtering)
Retrieve a paginated list of leads.

- **Method**: `GET`
- **URL**: `/api/leads`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `search` (optional): Search term for name or email
  - `status` (optional): Filter by status (`New`, `Contacted`, `Qualified`, `Lost`)
  - `source` (optional): Filter by source (`Website`, `Instagram`, `Referral`)
  - `sort` (optional): Sort by creation date (`Latest`, `Oldest`)

**Response (200 OK):**
```json
{
  "leads": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "Alice Smith",
      "email": "alice@example.com",
      "status": "New",
      "source": "Website",
      "createdAt": "2026-05-17T12:00:00.000Z",
      "updatedAt": "2026-05-17T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "pages": 5
  }
}
```

### 2. Create New Lead
Create a new lead. **(Admin Only)**

- **Method**: `POST`
- **URL**: `/api/leads`
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "Bob Jones",
  "email": "bob@jones.com",
  "status": "Contacted",
  "source": "Referral"
}
```

**Response (201 Created):**
```json
{
  "_id": "60d0fe4f5311236168a109cc",
  "name": "Bob Jones",
  "email": "bob@jones.com",
  "status": "Contacted",
  "source": "Referral",
  "createdAt": "2026-05-17T12:15:00.000Z",
  "updatedAt": "2026-05-17T12:15:00.000Z"
}
```

### 3. Update Lead
Update an existing lead.

- **Method**: `PUT`
- **URL**: `/api/leads/:id`
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

**Request Body:**
```json
{
  "status": "Qualified"
}
```

**Response (200 OK):**
```json
{
  "_id": "60d0fe4f5311236168a109cc",
  "name": "Bob Jones",
  "email": "bob@jones.com",
  "status": "Qualified",
  "source": "Referral",
  "createdAt": "2026-05-17T12:15:00.000Z",
  "updatedAt": "2026-05-17T12:30:00.000Z"
}
```

### 4. Delete Lead
Delete a lead by ID. **(Admin Only)**

- **Method**: `DELETE`
- **URL**: `/api/leads/:id`
- **Headers**: `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Lead removed successfully"
}
```

---

## Error Responses

When an error occurs (e.g., validation failure or unauthorized access), the API standardizes error responses with a consistent format:

**Response (400 Bad Request / 401 Unauthorized / 403 Forbidden / 404 Not Found):**
```json
{
  "message": "Descriptive error message here",
  "stack": "Stack trace (Only present in development environment)"
}
```
