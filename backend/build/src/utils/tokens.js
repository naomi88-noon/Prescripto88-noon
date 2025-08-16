"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccess = signAccess;
exports.verifyAccess = verifyAccess;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function signAccess(sub, role) {
    return jsonwebtoken_1.default.sign({ sub, role, type: 'access' }, env_1.env.jwt.accessSecret, {
        expiresIn: env_1.env.jwt.accessTtl,
    });
}
function verifyAccess(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.jwt.accessSecret);
}
