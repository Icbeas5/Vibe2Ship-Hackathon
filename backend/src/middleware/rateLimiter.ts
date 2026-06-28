import { Request, Response, NextFunction } from 'express';

const ipWindowMap = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = (req.ip || req.headers['x-forwarded-for'] || 'unknown-client') as string;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1-minute tracking window frame duration
  const maximumRequests = 45;   // Prevent Gemini API abuse

  const clientRecord = ipWindowMap.get(clientIp);

  if (!clientRecord || now > clientRecord.resetTime) {
    ipWindowMap.set(clientIp, { count: 1, resetTime: now + windowMs });
    return next();
  }

  clientRecord.count++;
  if (clientRecord.count > maximumRequests) {
    return res.status(429).json({
      error: 'Too many requests. API throughput rate limit safety triggers activated.'
    });
  }

  next();
};
