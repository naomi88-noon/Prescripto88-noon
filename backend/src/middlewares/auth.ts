import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/tokens';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export function auth(requiredRoles?: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header)
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing token' } });
    const token = header.replace('Bearer ', '');
    try {
      const payload = verifyAccess(token);
      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient role' } });
      }
      req.user = { id: payload.sub, role: payload.role };
      next();
    } catch (err) {
      return res
        .status(401)
        .json({ error: { code: 'INVALID_TOKEN', message: 'Token invalid or expired' } });
    }
  };
}

// optionalAuth: attaches user if token present; otherwise continues anonymously
export function optionalAuth(requiredRoles?: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) return next();
    const token = header.replace('Bearer ', '');
    try {
      const payload = verifyAccess(token);
      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        // If role requirement not met, treat as unauthenticated instead of 403 for optional auth
        return next();
      }
      req.user = { id: payload.sub, role: payload.role };
    } catch {
      // ignore invalid token for optional auth
    }
    return next();
  };
}
