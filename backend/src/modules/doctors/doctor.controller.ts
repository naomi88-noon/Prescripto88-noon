import { Request, Response } from 'express';
import { Doctor } from '../../models/Doctor';
import { genId } from '../../utils/id';
import { Op } from 'sequelize';

export async function listDoctors(req: Request, res: Response) {
  const { speciality, search, page = '1', limit = '20' } = req.query as Record<string, string>;
  const where: any = {};

  if (speciality) where.speciality = speciality;
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { speciality: { [Op.like]: `%${search}%` } },
      { degree: { [Op.like]: `%${search}%` } },
    ];
  }

  const p = parseInt(page, 10);
  const l = parseInt(limit, 10);

  const { rows, count } = await Doctor.findAndCountAll({
    where,
    offset: (p - 1) * l,
    limit: l,
    order: [['createdAt', 'DESC']],
  });

  // Add full image URL
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const doctorsWithImage = rows.map((doc: any) => ({
    ...doc.toJSON(),
    image: doc.image ? `${baseUrl}${doc.image}` : null,
  }));

  res.json({
    data: doctorsWithImage,
    meta: { page: p, limit: l, total: count },
  });
}


export async function getDoctor(req: Request, res: Response) {
  const doctor = await Doctor.findByPk(req.params.id);
  if (!doctor){
    console.log(`Doctor with ID ${req.params.id} not found `);
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Doctor not found' } });
  }
  console.log(` Doctor with ID ${req.params.id} retrieved successfully`);
 res.json(doctor);

}

export async function createDoctor(req: Request, res: Response) {
  const { name, speciality, fee, addressLine1 } = req.body;
  if (!name || !speciality || fee == null || !addressLine1)
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Missing fields' } });
  const file = (req as any).file as any | undefined;
  const imageUrl = file ? `/static/doctor/${file.filename}` : null;
  const doctor = await Doctor.create({
    id: genId('doc'),
    name,
    speciality,
    fee: Number(fee),
    addressLine1,
    experienceYears: Number(req.body.experienceYears) || 0,
    image: imageUrl,
    degree: req.body.degree || null,
    about: req.body.about || null,
    addressLine2: req.body.addressLine2 || null,
    rating: Number(req.body.rating) || 0,
    availability: req.body.availability || null,
  });
  res.status(201).json(doctor);
}

export async function updateDoctor(req: Request, res: Response) {
  const doctor = await Doctor.findByPk(req.params.id);
  if (!doctor)
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Doctor not found' } });
  const allowed = [
    'name','speciality','fee','addressLine1','addressLine2','experienceYears','image','degree','about','active','rating','availability'
  ];
  const updates: any = {};
  for (const k of allowed) if (k in req.body) updates[k] = (req.body as any)[k];
  await doctor.update(updates);
  res.json(doctor);
}

export async function getDoctorSlots(req: Request, res: Response) {
  const { id } = req.params;
  const doctor = await Doctor.findByPk(id);
  if (!doctor)
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Doctor not found' } });
  const date = req.query.date ? new Date(String(req.query.date)) : new Date();
  // Generate 10 half-hour slots from 10:00 to 15:00 as placeholder
  const base = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 10, 0, 0, 0));
  const slots = [] as { start: string; end: string; available: boolean }[];
  for (let i = 0; i < 10; i++) {
    const start = new Date(base.getTime() + i * 30 * 60000);
    const end = new Date(start.getTime() + 30 * 60000);
    slots.push({ start: start.toISOString(), end: end.toISOString(), available: true });
  }
  res.json(slots);
}
