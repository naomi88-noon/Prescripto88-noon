# Consulto API Implementation Guide

Version: 0.2.0

This document complements `openapi.yaml` and details endpoints, payload shapes, validation, auth rules, image storage strategy, and suggested DB schema.

Base URL: http://localhost:8080 (ENV: API_BASE_URL)
Auth: JWT (access ~2h) + refresh token rotation (UUID stored server-side).
Header: Authorization: Bearer <accessToken>
Content-Type: application/json unless stated.

## Changelog
- 0.2.0: Added doctor fields (degree, experienceYears, about, rating, availability), public doctor list/detail, slots endpoint, image upload endpoint (planned), COMPLETED appointment status, enriched search & docs.
- 0.1.0: Initial draft.

## 1. Authentication
### POST /auth/register
Body: { name (1-80), email, password (>=6) }
201 { user:{ id,name,email,role } } | 409 email exists
Hash password (bcrypt cost 10–12).

### POST /auth/login
Body: { email, password }
200 { accessToken, refreshToken, user } | 401 invalid credentials

### POST /auth/refresh
Body: { refreshToken } → rotate token pair. 401 invalid/expired.

### POST /auth/logout
Body: { refreshToken } → revoke. 200 { success:true }

Token claims: { sub, role, iat, exp }

## 2. Doctors
Changelog (0.2.0): Extended schema & public endpoints, slots, image upload.

### GET /doctors (public)
Query: speciality?, search? (name OR speciality OR degree ILIKE), page=1, limit=20 (max 100)
200 { data: Doctor[], meta:{ page,limit,total } }

### GET /doctors/:id (public)
200 Doctor | 404

### POST /doctors (Admin)
Multipart form-data (image upload at creation): fields name, speciality, fee, addressLine1, (optional) degree, experienceYears, about, availability, rating plus file field `image`.
Defaults: active=true, rating=0. Image required.
201 Doctor | 403

### PATCH /doctors/:id (Admin)
Body: allowed subset (name, speciality, fee>=0, degree, experienceYears, about, image, availability, rating, active, address lines)
200 Doctor | 404

### GET /doctors/:id/slots (public)
Query: date=YYYY-MM-DD (default today)
200 [ { start, end, available } ] (placeholder algorithm in v0.2)

### PUT /doctors/:id/image (Admin)
Multipart upload (jpeg/png/webp) → updates doctor.image
200 Doctor | 400 invalid | 404 | 415 unsupported | 403

### Doctor Object (superset)
{
  id: string,
  name: string,
  image?: string,
  speciality: string,
  degree?: string,
  experienceYears?: number,
  about?: string,
  fee: number,
  rating: number,
  availability?: object, // schedule JSON
  address: { line1: string, line2?: string },
  active: boolean,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}

Filtering: speciality exact + optional search OR across name/speciality/degree.
Sorting: default name ASC (extend later with sort param).

## 3. Appointments
### GET /appointments
Scoped by role: PATIENT own; DOCTOR their doctorId; ADMIN all.
200 Appointment[]

### POST /appointments (Patient)
Body: { doctorId, start, end }
Rules: start<end; duration<=2h; 30m boundaries; start >= now + lead (~5m); doctor active; no overlapping BOOKED.
201 Appointment | 400 SLOT_TAKEN / validation

### PATCH /appointments/:id/cancel
Permitted: patient owner OR doctor OR admin. BOOKED→CANCELLED only.
200 Appointment | 404

Future: PATCH /appointments/:id/complete (doctor) sets COMPLETED.

### Appointment Object
{
  id: string,
  doctorId: string,
  userId: string, // patient
  start: ISO8601,
  end: ISO8601,
  status: BOOKED | CANCELLED | COMPLETED,
  createdAt: ISO8601,
  updatedAt: ISO8601
}

Overlap logic (current): guards identical start only. TODO: full interval intersection check.

## 4. Health
GET /health → 200 { status:"UP" }

## 5. Error Format
{ error: { code, message, details?[] } }
Examples:
- 400 VALIDATION_ERROR { details:[{ field, issue }] }
- 401 UNAUTHORIZED
- 403 FORBIDDEN
- 404 NOT_FOUND
- 409 SLOT_TAKEN

Canonical codes: INVALID_CREDENTIALS, EMAIL_EXISTS, TOKEN_EXPIRED, INVALID_REFRESH, NOT_FOUND, SLOT_TAKEN, VALIDATION_ERROR, FORBIDDEN, UNAUTHORIZED.

## 6. Database Schema (Suggested)
Users(id pk, name, email unique, password_hash, role, created_at, updated_at)
Doctors(id pk, user_id fk?, name, speciality, fee, degree, experience_years, about, image_url, address_line1, address_line2, rating, availability jsonb, active, created_at, updated_at)
Appointments(id pk, doctor_id fk, user_id fk, start timestamptz, end timestamptz, status, created_at, updated_at)
RefreshTokens(id pk uuid, user_id fk, token_hash, expires_at, revoked boolean, created_at, rotated_from nullable)

Indexes:
- appointments (doctor_id, start) where status='BOOKED'
- doctors (speciality)
- users (email unique)

## 7. Validation & Security
- Schema validation (Zod/Joi) mirroring OpenAPI.
- Rate limit login (e.g. 5/min/IP).
- Hash refresh tokens (SHA256).
- HTTPS + secure cookies in production.
- Verify file MIME & magic for images.

## 8. Implementation Order
1. Auth
2. Doctor list/get
3. Appointments (book/list/cancel)
4. Doctor admin create/update
5. Slots computation
6. Image upload
7. Hardening (rate limits, logging)

## 9. Image Upload Strategy
Endpoint: PUT /doctors/:id/image (Admin)
Request: multipart/form-data { file }
Validation: MIME (image/jpeg|png|webp), size <=2MB, optional min 200x200.
Response: 200 Doctor (updated image)
Errors: 400 invalid file, 401/403 auth, 404 doctor, 415 unsupported

Storage Options:
- MVP: Local disk (/uploads/doctor) served at /static/doctor with cache headers (Cache-Control: public, max-age=604800, immutable)
- Scale: S3/Spaces pre-signed PUT + CDN

Filename pattern: doctorId-timestamp.ext
Security: verify magic bytes, remove old file, disallow user-chosen filenames.
Optional optimization: convert to WebP + standardized 400x400 via sharp.

Example (client):
```js
const form = new FormData();
form.append('file', file);
await fetch(`/api/doctors/${id}/image`, { method:'PUT', headers:{ Authorization:`Bearer ${token}` }, body: form });
```

## 10. Availability JSON Example
{
  "timezone": "UTC",
  "weekly": { "mon": [{"start":"09:00","end":"12:00"},{"start":"13:00","end":"17:00"}] },
  "exceptions": { "2025-12-25": [] },
  "slotDurationMinutes": 30
}
Slot generation: expand weekly -> subtract booked -> filter past -> output.

## 11. Frontend Integration Notes
- Set VITE_API_BASE_URL.
- Keep accessToken in memory; on 401 attempt refresh once then logout.
- Optimistic UI for booking; rollback on SLOT_TAKEN.
- Use doctor.image or placeholder.

## 12. Future Extensions
- Reviews & Ratings write endpoints
- Payments & invoices
- Doctor availability UI builder
- Pre-signed S3 direct uploads
- Rate limiting & audit logging
- Interval overlap algorithm improvements

## 13. Testing Checklist
- Auth register/login/refresh/logout
- Refresh rotation invalidates old
- Doctor search (name/speciality/degree)
- Appointment booking constraints & cancellation
- Slots endpoint date filter
- Image upload validation & replacement
- Pagination meta correctness

---
Keep openapi.yaml updated alongside code changes.
