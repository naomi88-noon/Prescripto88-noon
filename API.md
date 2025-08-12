# API Contract & Frontend Integration

Proposed RESTful API to support the doctor discovery and appointment booking platform. Backend: Node.js (Express) + PostgreSQL (via Prisma or Knex). Auth: JWT (HTTP-only cookie or Authorization header). All responses JSON.

Base URL (env): `VITE_API_BASE_URL` (e.g. https://api.consulto.example)

## Authentication

- Strategy: Email + password with JWT access token (15m) + refresh token (7d) rotated.
- Storage: Access token in memory; refresh via httpOnly secure cookie OR refresh endpoint.
- Passwords: Bcrypt hashed.

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/register | Public | Create patient account |
| POST | /auth/login | Public | Authenticate; returns tokens & user profile |
| POST | /auth/refresh | Cookie | Issue new access token |
| POST | /auth/logout | Auth | Invalidate refresh token |

#### Register
Request:
```json
POST /auth/register
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Passw0rd!"
}
```
Response 201:
```json
{ "user": { "id": "u_123", "name": "Jane Doe", "email": "jane@example.com", "role": "patient" } }
```

#### Login
```json
POST /auth/login
{ "email": "jane@example.com", "password": "Passw0rd!" }
```
Response 200:
```json
{
  "accessToken": "jwt...",
  "refreshToken": "jwt...", // if using local storage; else httpOnly cookie
  "user": { "id": "u_123", "name": "Jane Doe", "email": "jane@example.com", "role": "patient" }
}
```

Errors (example):
```json
{ "error": { "code": "INVALID_CREDENTIALS", "message": "Email or password incorrect" } }
```

## Doctors

| Method | Path | Auth | Query Params | Description |
|--------|------|------|--------------|-------------|
| GET | /doctors | Optional | speciality, search, page, limit | List doctors |
| GET | /doctors/:id | Optional | — | Doctor detail |
| GET | /doctors/:id/slots | Optional | date=YYYY-MM-DD | Available slots (computed) |
| POST | /doctors | Admin | — | Create doctor |
| PATCH | /doctors/:id | Admin | — | Update doctor |
| DELETE | /doctors/:id | Admin | — | Soft delete doctor |

Doctor representation:
```json
{
  "id": "doc_abc123",
  "name": "Dr. Emily Larson",
  "image": "https://cdn.example.com/doctors/doc2.png",
  "speciality": "Gynecologist",
  "degree": "MBBS",
  "experienceYears": 3,
  "about": "...",
  "fee": 60,
  "address": { "line1": "27th Cross", "line2": "Ring Road, London" },
  "rating": 4.8,
  "active": true
}
```

## Slots / Availability

Two strategies:
1. Derived schedule (static schedule rules + booked appointments → computed free slots)
2. Pre-generated slots table

Endpoint (computed):
```
GET /doctors/:id/slots?date=2025-08-11
[
  { "start": "2025-08-11T10:00:00Z", "end": "2025-08-11T10:30:00Z", "available": true },
  { "start": "2025-08-11T10:30:00Z", "end": "2025-08-11T11:00:00Z", "available": false }
]
```

## Appointments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /appointments | Patient/Doctor | List appointments (filtered by user role) |
| POST | /appointments | Patient | Create appointment (book slot) |
| GET | /appointments/:id | Auth | Appointment detail |
| PATCH | /appointments/:id/cancel | Patient/Doctor | Cancel appointment |
| PATCH | /appointments/:id/complete | Doctor | Mark complete |

Create appointment request:
```json
POST /appointments
{
  "doctorId": "doc_abc123",
  "start": "2025-08-11T10:00:00Z",
  "end": "2025-08-11T10:30:00Z",
  "reason": "Routine check-up"
}
```
Response:
```json
{
  "id": "apt_789",
  "doctorId": "doc_abc123",
  "patientId": "u_123",
  "start": "2025-08-11T10:00:00Z",
  "end": "2025-08-11T10:30:00Z",
  "status": "BOOKED",
  "fee": 60,
  "createdAt": "2025-08-01T12:00:00Z"
}
```

Status Enum: BOOKED | CANCELLED | COMPLETED

Error samples:
```json
{ "error": { "code": "SLOT_TAKEN", "message": "Slot already booked" } }
```

## Payments (Optional Phase 2)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /payments/intent | Patient | Create payment intent (Stripe/Razorpay) |
| POST | /payments/webhook | Public (signed) | Handle gateway events |

## User Profile
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /me | Auth | Current user profile |
| PATCH | /me | Auth | Update name / avatar |

## Error Format (Unified)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'email' is invalid",
    "details": [{ "field": "email", "issue": "invalid_format" }],
    "requestId": "rq_abc123"
  }
}
```

## Pagination
Response wrapper for list endpoints:
```json
{
  "data": [/* items */],
  "meta": { "page": 1, "limit": 20, "total": 150 }
}
```

## Rate Limiting
- 100 requests / 15 min per IP (adjust by auth status).

## Frontend Consumption Plan

### Axios Client
```js
import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, withCredentials: true });
api.interceptors.request.use(cfg => { const t = authStore.getToken(); if (t) cfg.headers.Authorization = `Bearer ${t}`; return cfg; });
```

### React Query Example
```js
import { useQuery } from '@tanstack/react-query';
export function useDoctors(params){
  return useQuery({ queryKey: ['doctors', params], queryFn: async ()=> (await api.get('/doctors', { params })).data });
}
```

### Booking Flow
1. User navigates to `/doctors/:id` (detail page) → fetch `/doctors/:id` + `/doctors/:id/slots?date=YYYY-MM-DD`.
2. User selects slot → POST `/appointments`.
3. On success → optionally redirect to payment or show confirmation.
4. After payment success (if required) → update UI; invalidate `['appointments']` query cache.

### State Separation
- Context only for global ephemeral UI (theme, auth user, currency).
- Server state (doctors, appointments) via React Query.

## Security Considerations
- Use Helmet on backend.
- Enforce CORS allowlist for frontend origin.
- Validate and sanitize inputs (Joi / Zod).
- Limit file upload types for avatars (if added).
- Store refresh tokens hashed in DB for revocation.

## Versioning
- Use semantic versioning for API changes; prefix with /v1.
- Add `X-API-Version` header in responses.

## Monitoring & Observability
- Structured logging (pino / winston) with requestId.
- Metrics: request latency, error rate, booking conversion.
- Health endpoint: `GET /health` returns `{ status: 'ok', uptime, timestamp }`.

---
This contract guides backend implementation (see BACKEND.md) and frontend integration roadmap.
