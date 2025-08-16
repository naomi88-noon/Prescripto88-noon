import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

export const env = {
  port: parseInt(requireEnv('PORT', '3001'), 10),
  nodeEnv: requireEnv('NODE_ENV', 'development'),
  corsOrigin: requireEnv('CORS_ORIGIN', 'http://localhost:5173'),
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
    : [requireEnv('CORS_ORIGIN', 'http://localhost:5173')],
    
  db:requireEnv('DATABASE_URL'),
  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    accessTtl: parseInt(requireEnv('ACCESS_TOKEN_TTL', '900'), 10),
    refreshTtl: parseInt(requireEnv('REFRESH_TOKEN_TTL', '604800'), 10), //  24 hours
  },
  passwordSaltRounds: parseInt(requireEnv('PASSWORD_SALT_ROUNDS', '10'), 10),
  docs: {
    user: process.env.DOCS_USER || undefined,
    pass: process.env.DOCS_PASS || undefined,
    disableAuth: process.env.DOCS_DISABLE_AUTH === 'true',
  },
};
