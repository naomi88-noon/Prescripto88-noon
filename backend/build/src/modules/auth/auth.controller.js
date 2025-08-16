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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.createRefreshToken = createRefreshToken;
exports.refresh = refresh;
exports.logout = logout;
const User_1 = require("../../models/User");
const id_1 = require("../../utils/id");
const passwords_1 = require("../../utils/passwords");
const tokens_1 = require("../../utils/tokens");
const RefreshToken_1 = require("../../models/RefreshToken");
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../../config/env");
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                console.error('Register error: Missing fields', req.body);
                return res.status(400).json({ error: { code: 'VALIDATION', message: 'Missing fields' } });
            }
            const existing = yield User_1.User.findOne({ where: { email } });
            if (existing) {
                console.error('Register error: Email already in use', email);
                return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'Email already in use' } });
            }
            const user = yield User_1.User.create({
                id: (0, id_1.genId)('u'),
                name,
                email,
                password: yield (0, passwords_1.hashPassword)(password),
            });
            res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        }
        catch (err) {
            console.error('Register unexpected error:', err);
            res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                console.error('Login error: Missing credentials', req.body);
                return res.status(400).json({ error: { code: 'VALIDATION', message: 'Missing credentials' } });
            }
            const user = yield User_1.User.findOne({ where: { email } });
            if (!user) {
                console.error('Login error: User not found', email);
                return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });
            }
            const ok = yield (0, passwords_1.comparePassword)(password, user.password);
            if (!ok) {
                console.error('Login error: Password mismatch', email);
                return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });
            }
            const accessToken = (0, tokens_1.signAccess)(user.id, user.role);
            const refreshToken = yield createRefreshToken(user.id);
            res.json({
                accessToken,
                refreshToken: refreshToken.token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
            });
        }
        catch (err) {
            console.error('Login unexpected error:', err);
            res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
        }
    });
}
function createRefreshToken(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = crypto_1.default.randomUUID();
        const expiresAt = new Date(Date.now() + env_1.env.jwt.refreshTtl * 1000);
        return RefreshToken_1.RefreshToken.create({ token, userId, expiresAt });
    });
}
function refresh(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(400).json({ error: { code: 'VALIDATION', message: 'Missing refreshToken' } });
        const stored = yield RefreshToken_1.RefreshToken.findByPk(refreshToken);
        if (!stored || !stored.isActive)
            return res
                .status(401)
                .json({ error: { code: 'INVALID_REFRESH', message: 'Invalid or expired refresh token' } });
        const newToken = yield createRefreshToken(stored.userId);
        yield stored.update({ revokedAt: new Date(), replacedByToken: newToken.token });
        const user = yield User_1.User.findByPk(stored.userId);
        if (!user)
            return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
        const accessToken = (0, tokens_1.signAccess)(user.id, user.role);
        res.json({ accessToken, refreshToken: newToken.token });
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(400).json({ error: { code: 'VALIDATION', message: 'Missing refreshToken' } });
        const stored = yield RefreshToken_1.RefreshToken.findByPk(refreshToken);
        if (stored && stored.isActive)
            yield stored.update({ revokedAt: new Date() });
        res.json({ success: true });
    });
}
