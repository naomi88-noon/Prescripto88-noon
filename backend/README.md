# Consulto Backend (MySQL + Sequelize)

Implements core API for doctors, auth, and appointments. Based on BACKEND.md architecture adapted to MySQL + Sequelize.

## Stack

- Node.js + Express
- MySQL (mysql2 driver) + Sequelize ORM
- JWT auth (short-lived access JWT) + UUID refresh tokens (server-stored, rotatable/revocable)
- bcryptjs password hashing
- dotenv, helmet, cors, pino logging

## Setup

```bash
cp .env.example .env
# edit credentials
npm install
npm run dev
```

API listens on PORT (default 3001).

## Scripts

- dev: watch & reload (ts-node-dev)
- build: compile TypeScript
- start: run compiled build
- seed: insert sample users and doctors (idempotent)

## API Endpoints (Summary)

- GET /health
- POST /auth/register
- POST /auth/login
- POST /auth/refresh (rotate UUID refresh token)
- POST /auth/logout (revoke refresh token)
- GET /doctors (AUTH)
- GET /doctors/:id (AUTH)
- POST /doctors (ADMIN)
- PATCH /doctors/:id (ADMIN)
- GET /appointments (PATIENT; returns own only)
- POST /appointments (PATIENT; creates for caller)
- PATCH /appointments/:id/cancel (PATIENT; only own appointment)
- Docs: Swagger UI at /docs, ReDoc at /redoc, JSON at /docs.json, YAML download at /docs/download

All protected endpoints expect `Authorization: Bearer <access_token>`.

## Docs Security

Docs can be protected with basic auth (recommended outside dev):

- DOCS_USER, DOCS_PASS to enable auth
- DOCS_DISABLE_AUTH=true to disable protection (default in dev if unset)

## Improvements Next

- Add refresh token metadata auditing (IP / user-agent)
- Validation layer (Zod) & rate limiting
- Availability & slot calculation service
- Enhanced appointment overlap detection
- Seed script & migrations (umzug) for CI/CD

## Seeding

A small seed creates demo users and doctors.

- See `SEEDING.md` for details
- Run: `npm run seed`

## Notes

This is a minimal baseline; tighten security and add tests before production.
