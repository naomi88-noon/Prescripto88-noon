"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../db/sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: { type: sequelize_1.DataTypes.STRING(50), primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING(120), allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING(160), allowNull: false, unique: true },
    password: { type: sequelize_1.DataTypes.STRING(120), allowNull: false },
    role: {
        type: sequelize_1.DataTypes.ENUM('PATIENT', 'DOCTOR', 'ADMIN'),
        allowNull: false,
        defaultValue: 'PATIENT',
    },
}, { sequelize: sequelize_2.sequelize, tableName: 'users' });
