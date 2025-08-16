"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const appointment_controller_1 = require("./appointment.controller");
exports.appointmentRouter = (0, express_1.Router)();
// Auth required; controller enforces role-based filtering/permissions
exports.appointmentRouter.get('/', (0, auth_1.auth)(), appointment_controller_1.listAppointments);
exports.appointmentRouter.post('/', (0, auth_1.auth)(['PATIENT']), appointment_controller_1.createAppointment);
exports.appointmentRouter.patch('/:id/cancel', (0, auth_1.auth)(), appointment_controller_1.cancelAppointment);
