import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(env.passwordSaltRounds);
  return bcrypt.hash(plain, salt);
}
export function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
