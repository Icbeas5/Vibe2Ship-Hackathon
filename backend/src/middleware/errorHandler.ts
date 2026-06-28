import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("Unhandled global exception thrown within application container:", err);
  res.status(err.status || 500).json({
    error: err.message || 'Critical internal process interruption encountered.'
  });
};
