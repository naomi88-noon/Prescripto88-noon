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
exports.listDoctors = listDoctors;
exports.getDoctor = getDoctor;
exports.createDoctor = createDoctor;
exports.updateDoctor = updateDoctor;
exports.getDoctorSlots = getDoctorSlots;
const Doctor_1 = require("../../models/Doctor");
const id_1 = require("../../utils/id");
const sequelize_1 = require("sequelize");
function listDoctors(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { speciality, search, page = '1', limit = '20' } = req.query;
        const where = {};
        if (speciality)
            where.speciality = speciality;
        if (search) {
            where[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.like]: `%${search}%` } },
                { speciality: { [sequelize_1.Op.like]: `%${search}%` } },
                { degree: { [sequelize_1.Op.like]: `%${search}%` } },
            ];
        }
        const p = parseInt(page, 10);
        const l = parseInt(limit, 10);
        const { rows, count } = yield Doctor_1.Doctor.findAndCountAll({
            where,
            offset: (p - 1) * l,
            limit: l,
            order: [['createdAt', 'DESC']],
        });
        // Add full image URL
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const doctorsWithImage = rows.map((doc) => (Object.assign(Object.assign({}, doc.toJSON()), { image: doc.image ? `${baseUrl}${doc.image}` : null })));
        res.json({
            data: doctorsWithImage,
            meta: { page: p, limit: l, total: count },
        });
    });
}
function getDoctor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const doctor = yield Doctor_1.Doctor.findByPk(req.params.id);
        if (!doctor)
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Doctor not found' } });
        res.json(doctor);
    });
}
function createDoctor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, speciality, fee, addressLine1 } = req.body;
        if (!name || !speciality || fee == null || !addressLine1)
            return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Missing fields' } });
        const file = req.file;
        const imageUrl = file ? `/static/doctor/${file.filename}` : null;
        const doctor = yield Doctor_1.Doctor.create({
            id: (0, id_1.genId)('doc'),
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
    });
}
function updateDoctor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const doctor = yield Doctor_1.Doctor.findByPk(req.params.id);
        if (!doctor)
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Doctor not found' } });
        const allowed = [
            'name', 'speciality', 'fee', 'addressLine1', 'addressLine2', 'experienceYears', 'image', 'degree', 'about', 'active', 'rating', 'availability'
        ];
        const updates = {};
        for (const k of allowed)
            if (k in req.body)
                updates[k] = req.body[k];
        yield doctor.update(updates);
        res.json(doctor);
    });
}
function getDoctorSlots(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const doctor = yield Doctor_1.Doctor.findByPk(id);
        if (!doctor)
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Doctor not found' } });
        const date = req.query.date ? new Date(String(req.query.date)) : new Date();
        // Generate 10 half-hour slots from 10:00 to 15:00 as placeholder
        const base = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 10, 0, 0, 0));
        const slots = [];
        for (let i = 0; i < 10; i++) {
            const start = new Date(base.getTime() + i * 30 * 60000);
            const end = new Date(start.getTime() + 30 * 60000);
            slots.push({ start: start.toISOString(), end: end.toISOString(), available: true });
        }
        res.json(slots);
    });
}
