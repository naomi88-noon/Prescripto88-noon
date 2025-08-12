import { Request, Response } from 'express';
import { User } from '../../models/User';
import { genId } from '../../utils/id';
import { hashPassword, comparePassword } from '../../utils/passwords';
import { signAccess } from '../../utils/tokens';
import { RefreshToken } from '../../models/RefreshToken';
import crypto from 'crypto';
import { env } from '../../config/env';

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: { code: 'VALIDATION', message: 'Missing fields' } });
  const existing = await User.findOne({ where: { email } });
  if (existing)
    return res
      .status(409)
      .json({ error: { code: 'EMAIL_EXISTS', message: 'Email already in use' } });
  const user = await User.create({
    id: genId('u'),
    name,
    email,
    password: await hashPassword(password),
  });
  res
    .status(201)
    .json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: { code: 'VALIDATION', message: 'Missing credentials' } });
  const user = await User.findOne({ where: { email } });
  if (!user)
    return res
      .status(401)
      .json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });
  const ok = await comparePassword(password, user.password);
  if (!ok)
    return res
      .status(401)
      .json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });
  const accessToken = signAccess(user.id, user.role);
  const refreshToken = await createRefreshToken(user.id);
  res.json({
    accessToken,
    refreshToken: refreshToken.token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

async function createRefreshToken(userId: string) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + env.jwt.refreshTtl * 1000);
  return RefreshToken.create({ token, userId, expiresAt });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ error: { code: 'VALIDATION', message: 'Missing refreshToken' } });
  const stored = await RefreshToken.findByPk(refreshToken);
  if (!stored || !stored.isActive)
    return res
      .status(401)
      .json({ error: { code: 'INVALID_REFRESH', message: 'Invalid or expired refresh token' } });
  const newToken = await createRefreshToken(stored.userId);
  await stored.update({ revokedAt: new Date(), replacedByToken: newToken.token });
  const user = await User.findByPk(stored.userId);
  if (!user)
    return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
  const accessToken = signAccess(user.id, user.role);
  res.json({ accessToken, refreshToken: newToken.token });
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ error: { code: 'VALIDATION', message: 'Missing refreshToken' } });
  const stored = await RefreshToken.findByPk(refreshToken);
  if (stored && stored.isActive) await stored.update({ revokedAt: new Date() });
  res.json({ success: true });
}
