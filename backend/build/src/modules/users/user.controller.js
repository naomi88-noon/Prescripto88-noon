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
exports.listUsers = listUsers;
exports.getMe = getMe;
exports.updateMe = updateMe;
exports.deleteMe = deleteMe;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const sequelize_1 = require("sequelize");
const User_1 = require("../../models/User");
const passwords_1 = require("../../utils/passwords");
function listUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = Math.max(parseInt(String(req.query.page || '1'), 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(String(req.query.limit || '20'), 10) || 20, 1), 100);
        const search = String(req.query.search || '').trim();
        const where = {};
        if (search) {
            where[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.like]: `%${search}%` } },
                { email: { [sequelize_1.Op.like]: `%${search}%` } },
            ];
        }
        const { rows, count } = yield User_1.User.findAndCountAll({
            where,
            offset: (page - 1) * limit,
            limit,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name', 'email', 'role', 'createdAt'],
        });
        res.json({ data: rows, meta: { page, limit, total: count } });
    });
}
function getMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
        const user = yield User_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
        res.json(sanitize(user));
    });
}
function updateMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
        const user = yield User_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
        const { name, email, password } = req.body;
        const updates = {};
        if (name)
            updates.name = name;
        if (email && email !== user.email) {
            const exists = yield User_1.User.findOne({ where: { email } });
            if (exists)
                return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'Email already in use' } });
            updates.email = email;
        }
        if (password) {
            if (password.length < 6)
                return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Password too short' } });
            updates.password = yield (0, passwords_1.hashPassword)(password);
        }
        yield user.update(updates);
        res.json(sanitize(user));
    });
}
function deleteMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
        const user = yield User_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
        yield user.destroy();
        res.status(204).send();
    });
}
// Admin operations
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User_1.User.findByPk(req.params.id);
        if (!user)
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
        res.json(sanitize(user));
    });
}
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User_1.User.findByPk(req.params.id);
        if (!user)
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
        const { name, email, password, role } = req.body;
        const updates = {};
        if (name)
            updates.name = name;
        if (email && email !== user.email) {
            const exists = yield User_1.User.findOne({ where: { email } });
            if (exists)
                return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'Email already in use' } });
            updates.email = email;
        }
        if (password) {
            if (password.length < 6)
                return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Password too short' } });
            updates.password = yield (0, passwords_1.hashPassword)(password);
        }
        if (role && ['PATIENT', 'DOCTOR', 'ADMIN'].includes(role))
            updates.role = role;
        yield user.update(updates);
        res.json(sanitize(user));
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User_1.User.findByPk(req.params.id);
        if (!user)
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
        yield user.destroy();
        res.status(204).send();
    });
}
function sanitize(user) {
    return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt };
}
