import 'dotenv/config';
import { sequelize } from '../db/sequelize';
import { User } from '../models/User';
import { Doctor } from '../models/Doctor';
import { genId } from '../utils/id';
import bcrypt from 'bcryptjs';
import { logger } from '../config/logger';
import { Appointment } from '../models/Appointment';

async function up() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    // Users
    const password = await bcrypt.hash('Passw0rd!', 10);
    const users = [
      { id: genId('u'), name: 'Alice Patient', email: 'alice@example.com', password, role: 'PATIENT' as const },
      { id: genId('u'), name: 'Bob Patient', email: 'bob@example.com', password, role: 'PATIENT' as const },
      { id: genId('u'), name: 'Dr. Admin', email: 'admin@example.com', password, role: 'ADMIN' as const },
    ];
    for (const u of users) {
      await User.findOrCreate({ where: { email: u.email }, defaults: u });
    }

    // Doctors
    const doctors = [
      {
        id: genId('doc'),
        name: 'Dr. Olivia Smith',
        image: null,
        speciality: 'Dermatologist',
        degree: 'MD',
        experienceYears: 8,
        about: 'Skin care specialist with focus on acne and eczema.',
        fee: 60,
        addressLine1: '12 Skin Ave, MedCity',
        addressLine2: null,
        active: true,
      },
      {
        id: genId('doc'),
        name: 'Dr. Ethan Brown',
        image: null,
        speciality: 'Neurologist',
        degree: 'MD',
        experienceYears: 12,
        about: 'Neurology expert for migraine and sleep disorders.',
        fee: 90,
        addressLine1: '45 Neuro Blvd, HealthTown',
        addressLine2: 'Suite 200',
        active: true,
      },
      {
        id: genId('doc'),
        name: 'Dr. Sophia Davis',
        image: null,
        speciality: 'Pediatrician',
        degree: 'MBBS, MD',
        experienceYears: 6,
        about: 'Pediatrics with a gentle approach and preventive care.',
        fee: 50,
        addressLine1: '78 Kids St, CareVille',
        addressLine2: null,
        active: true,
      },
    ];

    for (const d of doctors) {
      await Doctor.findOrCreate({ where: { name: d.name, speciality: d.speciality }, defaults: d });
    }

    // Appointments
    const appointments = [
      {
        id: genId('apt'),
        patientId: 'u1',
        doctorId: 'doc1',
        date: new Date('2023-10-01T10:00:00Z'),
        status: 'CONFIRMED',
      },
      {
        id: genId('apt'),
        patientId: 'u2',
        doctorId: 'doc2',
        date: new Date('2023-10-02T11:00:00Z'),
        status: 'PENDING',
      },
      {
        id: genId('apt'),
        patientId: 'u1',
        doctorId: 'doc3',
        date: new Date('2023-10-03T12:00:00Z'),
        status: 'CANCELLED',
      },
    ];

    for (const a of appointments) {
      await Appointment.findOrCreate({ where: { id: a.id } });
    }

    logger.info('Database seeded successfully');
    logger.info('Seed completed');
  } catch (err) {
    logger.error({ err }, 'Seed failed');
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

up();
