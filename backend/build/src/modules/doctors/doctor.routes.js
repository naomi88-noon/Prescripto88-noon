"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorRouter = void 0;
const express_1 = require("express");
const doctor_controller_1 = require("./doctor.controller");
const upload_1 = require("../../middlewares/upload");
const auth_1 = require("../../middlewares/auth");
exports.doctorRouter = (0, express_1.Router)();
exports.doctorRouter.get('/', (0, auth_1.optionalAuth)(), doctor_controller_1.listDoctors); // public list (auth optional)
exports.doctorRouter.get('/:id', (0, auth_1.optionalAuth)(), doctor_controller_1.getDoctor); // public detail
exports.doctorRouter.get('/:id/slots', (0, auth_1.optionalAuth)(), doctor_controller_1.getDoctorSlots);
exports.doctorRouter.post('/', upload_1.uploadDoctorImage.single('image'), doctor_controller_1.createDoctor);
//doctorRouter.post('/', auth(['ADMIN']), uploadDoctorImage.single('image'), createDoctor);
exports.doctorRouter.patch('/:id', (0, auth_1.auth)(['ADMIN']), doctor_controller_1.updateDoctor);
