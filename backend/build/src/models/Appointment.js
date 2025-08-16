"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../db/sequelize");
const Doctor_1 = require("./Doctor");
const User_1 = require("./User");
class Appointment extends sequelize_1.Model {
}
exports.Appointment = Appointment;
Appointment.init({
    id: { type: sequelize_1.DataTypes.STRING(50), primaryKey: true },
    doctorId: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
    patientId: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
    start: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    end: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM('BOOKED', 'CANCELLED', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'BOOKED',
    },
}, { sequelize: sequelize_2.sequelize, tableName: 'appointments' });
Doctor_1.Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor_1.Doctor, { foreignKey: 'doctorId' });
User_1.User.hasMany(Appointment, { foreignKey: 'patientId', as: 'patientAppointments' });
Appointment.belongsTo(User_1.User, { foreignKey: 'patientId', as: 'patient' });
