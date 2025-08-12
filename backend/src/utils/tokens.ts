import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface TokenPayload {
  sub: string;
  role: string;
  type: 'access';
}

export function signAccess(sub: string, role: string) {
  return jwt.sign({ sub, role, type: 'access' } as TokenPayload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessTtl,
  });
}
export function verifyAccess(token: string): TokenPayload {
  return jwt.verify(token, env.jwt.accessSecret) as TokenPayload;
}
