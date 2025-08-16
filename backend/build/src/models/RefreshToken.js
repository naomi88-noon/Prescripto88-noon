"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../db/sequelize");
const User_1 = require("./User");
class RefreshToken extends sequelize_1.Model {
    get isExpired() {
        return this.expiresAt.getTime() < Date.now();
    }
    get isActive() {
        return !this.revokedAt && !this.isExpired;
    }
}
exports.RefreshToken = RefreshToken;
RefreshToken.init({
    token: { type: sequelize_1.DataTypes.STRING(64), primaryKey: true },
    userId: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
    expiresAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    revokedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    replacedByToken: { type: sequelize_1.DataTypes.STRING(64), allowNull: true },
}, { sequelize: sequelize_2.sequelize, tableName: 'refresh_tokens' });
User_1.User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User_1.User, { foreignKey: 'userId' });
