"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const sequelize_1 = require("../db/sequelize");
const User_1 = require("../models/User");
const Doctor_1 = require("../models/Doctor");
const id_1 = require("../utils/id");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = require("../config/logger");
const Appointment_1 = require("../models/Appointment");
function up() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize_1.sequelize.authenticate();
            yield sequelize_1.sequelize.sync();
            // Users
            const password = yield bcryptjs_1.default.hash('Passw0rd!', 10);
            const users = [
                { id: (0, id_1.genId)('u'), name: 'Alice Patient', email: 'alice@example.com', password, role: 'PATIENT' },
                { id: (0, id_1.genId)('u'), name: 'Bob Patient', email: 'bob@example.com', password, role: 'PATIENT' },
                { id: (0, id_1.genId)('u'), name: 'Dr. Admin', email: 'admin@example.com', password, role: 'ADMIN' },
            ];
            for (const u of users) {
                yield User_1.User.findOrCreate({ where: { email: u.email }, defaults: u });
            }
            // Doctors
            const doctors = [
                {
                    id: (0, id_1.genId)('doc'),
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
                    id: (0, id_1.genId)('doc'),
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
                    id: (0, id_1.genId)('doc'),
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
                yield Doctor_1.Doctor.findOrCreate({ where: { name: d.name, speciality: d.speciality }, defaults: d });
            }
            // Appointments
            const appointments = [
                {
                    id: (0, id_1.genId)('apt'),
                    patientId: 'u1',
                    doctorId: 'doc1',
                    date: new Date('2023-10-01T10:00:00Z'),
                    status: 'CONFIRMED',
                },
                {
                    id: (0, id_1.genId)('apt'),
                    patientId: 'u2',
                    doctorId: 'doc2',
                    date: new Date('2023-10-02T11:00:00Z'),
                    status: 'PENDING',
                },
                {
                    id: (0, id_1.genId)('apt'),
                    patientId: 'u1',
                    doctorId: 'doc3',
                    date: new Date('2023-10-03T12:00:00Z'),
                    status: 'CANCELLED',
                },
            ];
            for (const a of appointments) {
                yield Appointment_1.Appointment.findOrCreate({ where: { id: a.id } });
            }
            logger_1.logger.info('Database seeded successfully');
            logger_1.logger.info('Seed completed');
        }
        catch (err) {
            logger_1.logger.error({ err }, 'Seed failed');
            process.exitCode = 1;
        }
        finally {
            yield sequelize_1.sequelize.close();
        }
    });
}
up();
