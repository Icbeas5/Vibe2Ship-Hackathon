import { Request, Response, NextFunction } from 'express';
// 🌟 Import the safely initialized auth instance and configuration flag from your central config
import { auth, isFirestoreConfigured } from '../config/firebase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication challenge failed: Missing authorization vector token' });
  }

  const token = authHeader.split(' ')[1];

  // 🌟 BYPASS CHECK: Catch the demo token before it reaches any verification pipelines
  if (token === 'demo-token-nova-system-override') {
    req.user = {
      uid: 'demo-operator-01',
      email: 'sandbox@nova.architecture'
    };
    return next();
  }

  // Fallback security block if your Firebase variables were completely missing and you aren't in demo mode
  if (!isFirestoreConfigured || !auth) {
    return res.status(503).json({ error: 'Database services offline. Try utilizing Local Override Demo Mode.' });
  }

  try {
    // 🌟 Use the central auth instance directly instead of calling admin.auth()
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    return next();
  } catch (error) {
    console.error("Security core // JWT signature verification faulted:", error);
    return res.status(403).json({ error: 'Access Denied: Invalid or expired access token parameters' });
  }
};