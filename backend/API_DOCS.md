# Consulto API Documentation

This document summarizes the REST API. For a machine-readable version see `openapi.yaml`.

Base URL: `http://localhost:3001` (dev)
Docs: Swagger UI `/docs`, ReDoc `/redoc`, raw JSON `/docs.json`, YAML download `/docs/download`

## Authentication

All protected endpoints expect `Authorization: Bearer <access_token>`.

### Register

POST /auth/register
Request:

```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "Passw0rd!" }
```

Responses:

- 201 CREATED `{ "user": { "id": "u_x", "name": "Jane Doe", "email": "jane@example.com", "role": "PATIENT" } }`
- 409 EMAIL_EXISTS

### Login

POST /auth/login

```json
{ "email": "jane@example.com", "password": "Passw0rd!" }
```

Success 200:

```json
{
  "accessToken": "...",
  "refreshToken": "uuid...",
  "user": { "id": "u_x", "name": "Jane Doe", "email": "jane@example.com", "role": "PATIENT" }
}
```

### Refresh Access Token

POST /auth/refresh

```json
{ "refreshToken": "uuid..." }
```

Success 200:

```json
{ "accessToken": "...", "refreshToken": "newUuid" }
```

### Logout

POST /auth/logout

```json
{ "refreshToken": "uuid..." }
```

Response 200: `{ "success": true }`

## Doctors

### List Doctors (Auth)

GET /doctors (requires Bearer token)
Query params:

- `speciality` (optional)
- `search` (optional substring match)
- `page` (default 1)
- `limit` (default 20)

Response 200:

```json
{
  "data": [{ "id": "doc_x", "name": "Dr. Smith", "speciality": "Dermatologist" }],
  "meta": { "page": 1, "limit": 20, "total": 1 }
}
```

### Get Doctor (Auth)

GET /doctors/{id} (requires Bearer token)

### Create Doctor (ADMIN)

POST /doctors

```json
{ "name": "Dr. Smith", "speciality": "Dermatologist", "fee": 50, "addressLine1": "123 Street" }
```

### Update Doctor (ADMIN)

PATCH /doctors/{id}
Partial fields allowed.

## Appointments

### List Appointments (Patients Only)

GET /appointments (requires PATIENT role)
- Returns only the caller's appointments

### Create Appointment (Patients Only)

POST /appointments (requires PATIENT role)

```json
{ "doctorId": "doc_x", "start": "2025-08-11T10:00:00Z", "end": "2025-08-11T10:30:00Z" }
```

### Cancel Appointment (Patients Only)

PATCH /appointments/{id}/cancel (requires PATIENT role; only own appointment)

## Error Format

```json
{ "error": { "code": "SLOT_TAKEN", "message": "Slot already booked" } }
```

## Common Error Codes

| Code                | Meaning                          |
| ------------------- | -------------------------------- |
| VALIDATION          | Invalid input data               |
| EMAIL_EXISTS        | Email already registered         |
| INVALID_CREDENTIALS | Login failed                     |
| INVALID_REFRESH     | Refresh token invalid or expired |
| NOT_FOUND           | Resource not found               |
| SLOT_TAKEN          | Appointment slot conflict        |
| FORBIDDEN           | Insufficient privileges          |
| UNAUTHORIZED        | Missing/invalid auth token       |

## Rate Limiting (Planned)

Future implementation: 100 requests / 15 min / IP.

## Versioning

Initial version is unversioned; future versions will prefix routes with `/v1`.

---

For detailed schemas and examples see OpenAPI spec below.
