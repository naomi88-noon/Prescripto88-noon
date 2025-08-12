import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import { listUsers, getMe, updateMe, deleteMe, getUser, updateUser, deleteUser } from './user.controller';

export const userRouter = Router();

// Admin-only: list all users
userRouter.get('/', auth(['ADMIN']), listUsers);
userRouter.get('/me', auth(), getMe);
userRouter.patch('/me', auth(), updateMe);
userRouter.delete('/me', auth(), deleteMe);

userRouter.get('/:id', auth(['ADMIN']), getUser);
userRouter.patch('/:id', auth(['ADMIN']), updateUser);
userRouter.delete('/:id', auth(['ADMIN']), deleteUser);
