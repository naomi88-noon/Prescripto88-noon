"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.optionalAuth = optionalAuth;
const tokens_1 = require("../utils/tokens");
function auth(requiredRoles) {
    return (req, res, next) => {
        const header = req.headers.authorization;
        if (!header)
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing token' } });
        const token = header.replace('Bearer ', '');
        try {
            const payload = (0, tokens_1.verifyAccess)(token);
            if (requiredRoles && !requiredRoles.includes(payload.role)) {
                return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient role' } });
            }
            req.user = { id: payload.sub, role: payload.role };
            next();
        }
        catch (err) {
            return res
                .status(401)
                .json({ error: { code: 'INVALID_TOKEN', message: 'Token invalid or expired' } });
        }
    };
}
// optionalAuth: attaches user if token present; otherwise continues anonymously
function optionalAuth(requiredRoles) {
    return (req, res, next) => {
        const header = req.headers.authorization;
        if (!header)
            return next();
        const token = header.replace('Bearer ', '');
        try {
            const payload = (0, tokens_1.verifyAccess)(token);
            if (requiredRoles && !requiredRoles.includes(payload.role)) {
                // If role requirement not met, treat as unauthenticated instead of 403 for optional auth
                return next();
            }
            req.user = { id: payload.sub, role: payload.role };
        }
        catch (_a) {
            // ignore invalid token for optional auth
        }
        return next();
    };
}
