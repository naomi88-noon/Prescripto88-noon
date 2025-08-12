import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import { createAppointment, listAppointments, cancelAppointment } from './appointment.controller';

export const appointmentRouter = Router();

// Auth required; controller enforces role-based filtering/permissions
appointmentRouter.get('/', auth(), listAppointments);
appointmentRouter.post('/', auth(['PATIENT']), createAppointment);
appointmentRouter.patch('/:id/cancel', auth(), cancelAppointment);
