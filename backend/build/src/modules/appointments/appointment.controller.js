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
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAppointments = listAppointments;
exports.createAppointment = createAppointment;
exports.cancelAppointment = cancelAppointment;
const Appointment_1 = require("../../models/Appointment");
const Doctor_1 = require("../../models/Doctor");
const id_1 = require("../../utils/id");
function listAppointments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user)
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Login required' } });
        let where = {};
        if (req.user.role === 'PATIENT')
            where.patientId = req.user.id;
        else if (req.user.role === 'DOCTOR')
            where.doctorId = req.user.id; // if doctor user id matches doctorId (future mapping)
        // ADMIN sees all
        const rows = yield Appointment_1.Appointment.findAll({ where });
        res.json(rows);
    });
}
function createAppointment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { doctorId, start, end } = req.body;
        if (!doctorId || !start || !end)
            return res.status(400).json({ error: { code: 'VALIDATION', message: 'Missing fields' } });
        const doctor = yield Doctor_1.Doctor.findByPk(doctorId);
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
        const overlap = yield Appointment_1.Appointment.findOne({
            where: {
                doctorId,
                status: 'BOOKED',
                start: startDate,
            },
        });
        if (overlap)
            return res.status(409).json({ error: { code: 'SLOT_TAKEN', message: 'Slot already booked' } });
        const apt = yield Appointment_1.Appointment.create({
            id: (0, id_1.genId)('apt'),
            doctorId,
            patientId: req.user.id,
            start: new Date(start),
            end: new Date(end),
        });
        res.status(201).json(apt);
    });
}
function cancelAppointment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const apt = yield Appointment_1.Appointment.findByPk(req.params.id);
        if (!apt)
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Appointment not found' } });
        if (!req.user)
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Login required' } });
        if (!((req.user.role === 'PATIENT' && apt.patientId === req.user.id) ||
            req.user.role === 'ADMIN'))
            return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not permitted' } });
        if (apt.status !== 'BOOKED')
            return res.status(400).json({ error: { code: 'INVALID_STATE', message: 'Cannot cancel' } });
        yield apt.update({ status: 'CANCELLED' });
        res.json(apt);
    });
}
