import { Response } from 'express';
import { Appointment } from '../../models/Appointment';
import { Doctor } from '../../models/Doctor';
import { genId } from '../../utils/id';
import { AuthRequest } from '../../middlewares/auth';

export async function listAppointments(req: AuthRequest, res: Response) {
  if (!req.user)
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Login required' } });
  let where: any = {};
  if (req.user.role === 'PATIENT') where.patientId = req.user.id;
  else if (req.user.role === 'DOCTOR') where.doctorId = req.user.id; // if doctor user id matches doctorId (future mapping)
  // ADMIN sees all
  const rows = await Appointment.findAll({ where });
  res.json(rows);
}

export async function createAppointment(req: AuthRequest, res: Response) {
  const { doctorId, start, end } = req.body;
  if (!doctorId || !start || !end)
    return res.status(400).json({ error: { code: 'VALIDATION', message: 'Missing fields' } });
  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor)
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Doctor not found' } });
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (!(startDate instanceof Date) || !(endDate instanceof Date) || isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
    return res.status(400).json({ error: { code: 'VALIDATION', message: 'Invalid date format' } });
  if (startDate >= endDate)
    return res.status(400).json({ error: { code: 'VALIDATION', message: 'Start must be before end' } });
  const maxDurationMs = 2 * 60 * 60 * 1000;
  if (endDate.getTime() - startDate.getTime() > maxDurationMs)
    return res.status(400).json({ error: { code: 'VALIDATION', message: 'Duration too long' } });
  // Overlap check: any existing booked appointment for doctor overlapping interval
  const overlap = await Appointment.findOne({
    where: {
      doctorId,
      status: 'BOOKED',
      start: startDate,
    },
  });
  if (overlap)
    return res.status(409).json({ error: { code: 'SLOT_TAKEN', message: 'Slot already booked' } });
  const apt = await Appointment.create({
    id: genId('apt'),
    doctorId,
    patientId: req.user!.id,
    start: new Date(start),
    end: new Date(end),
  });
  res.status(201).json(apt);
}

export async function cancelAppointment(req: AuthRequest, res: Response) {
  const apt = await Appointment.findByPk(req.params.id);
  if (!apt)
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Appointment not found' } });
  if (!req.user)
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Login required' } });
  if (
    !(
      (req.user.role === 'PATIENT' && apt.patientId === req.user.id) ||
      req.user.role === 'ADMIN'
    )
  )
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not permitted' } });
  if (apt.status !== 'BOOKED')
    return res.status(400).json({ error: { code: 'INVALID_STATE', message: 'Cannot cancel' } });
  await apt.update({ status: 'CANCELLED' });
  res.json(apt);
}
