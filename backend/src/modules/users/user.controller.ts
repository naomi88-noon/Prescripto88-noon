import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { User } from '../../models/User';
import { hashPassword } from '../../utils/passwords';

export async function listUsers(req: Request, res: Response) {
  const page = Math.max(parseInt(String(req.query.page || '1'), 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(String(req.query.limit || '20'), 10) || 20, 1), 100);
  const search = String(req.query.search || '').trim();
  const where: any = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }
  const { rows, count } = await User.findAndCountAll({
    where,
    offset: (page - 1) * limit,
    limit,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'name', 'email', 'role', 'createdAt'],
  });
  res.json({ data: rows, meta: { page, limit, total: count } });
}

export async function getMe(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  res.json(sanitize(user));
}

export async function updateMe(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  const { name, email, password } = req.body;
  const updates: any = {};
  if (name) updates.name = name;
  if (email && email !== user.email) {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'Email already in use' } });
    updates.email = email;
  }
  if (password) {
    if (password.length < 6)
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Password too short' } });
    updates.password = await hashPassword(password);
  }
  await user.update(updates);
  res.json(sanitize(user));
}

export async function deleteMe(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  await user.destroy();
  res.status(204).send();
}

// Admin operations
export async function getUser(req: Request, res: Response) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  res.json(sanitize(user));
}

export async function updateUser(req: Request, res: Response) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  const { name, email, password, role } = req.body;
  const updates: any = {};
  if (name) updates.name = name;
  if (email && email !== user.email) {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'Email already in use' } });
    updates.email = email;
  }
  if (password) {
    if (password.length < 6)
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Password too short' } });
    updates.password = await hashPassword(password);
  }
  if (role && ['PATIENT', 'DOCTOR', 'ADMIN'].includes(role)) updates.role = role;
  await user.update(updates);
  res.json(sanitize(user));
}

export async function deleteUser(req: Request, res: Response) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  await user.destroy();
  res.status(204).send();
}

function sanitize(user: User) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt };
}
