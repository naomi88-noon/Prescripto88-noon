"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../db/sequelize");
class Doctor extends sequelize_1.Model {
}
exports.Doctor = Doctor;
Doctor.init({
    id: { type: sequelize_1.DataTypes.STRING(50), primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING(140), allowNull: false },
    image: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
    speciality: { type: sequelize_1.DataTypes.STRING(80), allowNull: false },
    degree: { type: sequelize_1.DataTypes.STRING(80), allowNull: true },
    experienceYears: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    about: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    fee: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    addressLine1: { type: sequelize_1.DataTypes.STRING(160), allowNull: false },
    addressLine2: { type: sequelize_1.DataTypes.STRING(160), allowNull: true },
    active: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    rating: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    availability: { type: sequelize_1.DataTypes.JSON, allowNull: true },
}, { sequelize: sequelize_2.sequelize, tableName: 'doctors' });
