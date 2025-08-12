# Backend Plan (Node.js + PostgreSQL)

Proposed backend to support the frontend. We choose PostgreSQL for relational integrity, rich JSON support, and strong community tooling. We'll use Node.js with Express, Prisma ORM, JWT auth, and optional Stripe for payments.

## High-level Architecture
- Express REST API, layered architecture (routes → controllers → services → repositories → DB).
- PostgreSQL via Prisma ORM.
- Authentication via JWT (access + refresh), bcrypt password hashing.
- Validation with Zod or Joi.
- Logging with pino; error middleware with unified format.
- CORS allowed origins from env.

## Folder Structure
```
backend/
  src/
    app.ts (bootstrap express)
    server.ts (start HTTP)
    config/
      env.ts
      logger.ts
    middlewares/
      auth.ts
      error.ts
    utils/
      passwords.ts
      tokens.ts
    modules/
      auth/
        auth.routes.ts
        auth.controller.ts
        auth.service.ts
      users/
        user.routes.ts
        user.controller.ts
        user.service.ts
        user.repo.ts
      doctors/
        doctor.routes.ts
        doctor.controller.ts
        doctor.service.ts
        doctor.repo.ts
      slots/
        slot.routes.ts
        slot.controller.ts
        slot.service.ts
      appointments/
        appointment.routes.ts
        appointment.controller.ts
        appointment.service.ts
        appointment.repo.ts
  prisma/
    schema.prisma
  package.json
  tsconfig.json (optional if TS)
```

Note: If you prefer JS only, replace .ts with .js and remove TS config; keep structure identical.

## Database Schema (Prisma)
```prisma
model User {
  id        String  @id @default(cuid())
  name      String
  email     String  @unique
  password  String
  role      Role    @default(PATIENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  appointments Appointment[] @relation("PatientAppointments")
}

enum Role { PATIENT DOCTOR ADMIN }

model Doctor {
  id        String @id @default(cuid())
  name      String
  image     String
  speciality String
  degree    String
  experienceYears Int
  about     String
  fee       Int       // store in minor units or as integer currency
  addressLine1 String
  addressLine2 String?
  active    Boolean  @default(true)
  appointments Appointment[]
}

model Appointment {
  id        String @id @default(cuid())
  doctor    Doctor @relation(fields: [doctorId], references: [id])
  doctorId  String
  patient   User   @relation("PatientAppointments", fields: [patientId], references: [id])
  patientId String
  start     DateTime
  end       DateTime
  status    AppointmentStatus @default(BOOKED)
  createdAt DateTime @default(now())
}

enum AppointmentStatus { BOOKED CANCELLED COMPLETED }

// Optional if you want to predefine availability blocks
model Availability {
  id        String @id @default(cuid())
  doctor    Doctor @relation(fields: [doctorId], references: [id])
  doctorId  String
  dayOfWeek Int    // 0..6
  startTime String // HH:mm
  endTime   String // HH:mm
}
```

## Libraries
- express, cors, helmet
- zod (or joi) for validation
- jsonwebtoken, bcryptjs
- pino for logging
- prisma, @prisma/client, pg
- dotenv
- (optional) stripe, body-parser (raw) for webhooks

## Environment Variables
```
PORT=8080
DATABASE_URL=postgresql://user:pass@localhost:5432/consulto
JWT_ACCESS_SECRET=... 
JWT_REFRESH_SECRET=...
CORS_ORIGIN=http://localhost:5173
```

## Milestones & Commits

1) Project bootstrap
- Tasks: Initialize Node project, add Express, CORS, Helmet, health route, error middleware.
- Commit: chore(api): scaffold express app with security headers and health endpoint

2) Database setup
- Tasks: Add Prisma, configure schema, run migrations, seed doctors (from frontend dataset as seed).
- Commit: feat(db): add prisma schema and initial migration with seed doctors

3) Auth module
- Tasks: Register, login, refresh, logout; JWT utilities; auth middleware.
- Commit: feat(auth): implement JWT auth with register/login/refresh/logout endpoints

4) Doctors module
- Tasks: List, filter by speciality, search, detail; admin create/update/delete; active flag.
- Commit: feat(doctors): add CRUD and filtering endpoints with validation

5) Slots computation
- Tasks: Compute available slots from Availability + existing appointments; expose endpoint.
- Commit: feat(slots): compute and expose doctor availability slots endpoint

6) Appointments module
- Tasks: Create, list (by user/doctor), cancel, complete; conflict detection.
- Commit: feat(appointments): booking flow with conflict checks and status transitions

7) Payments (optional)
- Tasks: Stripe/Razorpay intent endpoint and webhook.
- Commit: feat(payments): add payment intent and webhook handlers

8) Observability & hardening
- Tasks: request logging, rate limiting, input validation everywhere, E2E tests.
- Commit: chore(obs): add pino request logger and rate limiting, strengthen validations

## Example Routes (Express)
```ts
app.get('/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.use('/auth', authRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', authMiddleware, appointmentRoutes);
```

## Validation Example (Zod)
```ts
const createAppointmentSchema = z.object({
  doctorId: z.string().min(1),
  start: z.string().datetime(),
  end: z.string().datetime(),
  reason: z.string().max(500).optional(),
});
```

## Seeding Doctors
- Copy the frontend `assets.assets_frontend.assets.js` dataset and map fields to DB schema.
- Convert `fees`→`fee`, `image` URL to CDN/local path.

## Integration Notes for Frontend
- Configure `VITE_API_BASE_URL` to backend URL.
- Replace context static list with API calls (React Query suggested):
  - GET `/doctors` (Home/AllDoctors)
  - GET `/doctors/:id` + `/doctors/:id/slots` (Appointment)
  - POST `/appointments` (booking)
- Use Authorization: Bearer <token> header for protected endpoints.

## Deployment
- Dockerize API and Postgres.
- Apply DB migrations on startup (Prisma migrate deploy).
- Use reverse proxy (Nginx) with HTTPS.

## Testing
- Unit tests for services (jest or vitest).
- Integration tests for routes with supertest.
- Seed test DB; run in CI.

## Error Handling
- Unified error response shape (see API.md): include code, message, requestId.
- Map known errors (validation, auth, not found, conflict) to 4xx; 5xx for unexpected.

---
This backend plan aligns with API.md and the current frontend. It provides clear milestones and commit messages for iterative delivery.
