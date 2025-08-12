# Database Seeding

Seed adds sample users and doctors for local development.

## What it creates
- Users:
  - alice@example.com (PATIENT) / Passw0rd!
  - bob@example.com (PATIENT) / Passw0rd!
  - admin@example.com (ADMIN) / Passw0rd!
- Doctors (3 demo profiles) across Dermatology, Neurology, Pediatrics.

## Run
- Ensure DB_* env vars are set (see README). Also JWT secrets can be any value for seeding.
- Then run:

```bash
npm run seed
```

Rerunning is safe; it uses findOrCreate.

## Notes
- Passwords are hashed with bcrypt.
- Adjust data in `src/scripts/seed.ts` as needed.
