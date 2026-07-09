import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { sanitizeInput } from '../utils/sanitize.js';

export const securityMiddleware = [
  helmet({ contentSecurityPolicy: false }),
  rateLimit({ windowMs: 15 * 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false }),
  (req, res, next) => {
    if (req.body) {
      req.body = sanitizeInput(req.body);
    }
    next();
  }
];
