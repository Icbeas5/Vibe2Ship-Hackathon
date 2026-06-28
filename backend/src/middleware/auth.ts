import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { env } from '../utils/env.js';

// Initialize the Firebase Admin Engine singleton securely using your service account credentials
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(env.GOOGLE_APPLICATION_CREDENTIALS)
  });
}

// Extend Express Request typing context dynamically to store our verified session operator
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

  // 🌟 BYPASS CHECK: Catch the demo token before it reaches the firebase-admin verifier
  if (token === 'demo-token-nova-system-override') {
    req.user = {
      uid: 'demo-operator-01',
      email: 'sandbox@nova.architecture'
    };
    return next(); // Pass cleanly through the router!
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
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