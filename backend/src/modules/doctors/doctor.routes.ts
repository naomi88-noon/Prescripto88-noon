import { Router } from 'express';
import { listDoctors, getDoctor, createDoctor, updateDoctor, getDoctorSlots } from './doctor.controller';
import { uploadDoctorImage } from '../../middlewares/upload';
import { auth, optionalAuth } from '../../middlewares/auth';

export const doctorRouter = Router();

doctorRouter.get('/', optionalAuth(), listDoctors); // public list (auth optional)
doctorRouter.get('/:id', optionalAuth(), getDoctor); // public detail
doctorRouter.get('/:id/slots', optionalAuth(), getDoctorSlots);
doctorRouter.post('/', auth(['ADMIN']), uploadDoctorImage.single('image'), createDoctor);
doctorRouter.patch('/:id', auth(['ADMIN']), updateDoctor);
