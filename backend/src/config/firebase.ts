import admin from 'firebase-admin';
import { env } from '../utils/env.js';
import { logger } from '../utils/logger.js';

let db: any = null;
let auth: any = null;
let isFirestoreConfigured = false;

try {
  // 1. Production Mode: Check if we provided the raw JSON text string in Render env
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: env.FIREBASE_PROJECT_ID || serviceAccount.project_id
    });
    
    db = admin.firestore();
    auth = admin.auth();
    isFirestoreConfigured = true;
    logger.info("Firebase Administrative Suite cloud container initialized securely from environment string matrix.");

  // 2. Development Mode: Fallback to your original applicationDefault configuration
  } else if (env.FIREBASE_PROJECT_ID && env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: env.FIREBASE_PROJECT_ID
    });
    
    db = admin.firestore();
    auth = admin.auth();
    isFirestoreConfigured = true;
    logger.info("Firebase Administrative Suite cloud container initialization validated via Application Default.");
    
  } else {
    logger.warn("Firebase environmental variables missing. Falling back instantly to production-grade InMemory memory matrix repositories.");
  }
} catch (e) {
  logger.error("Failed to map cloud infrastructure container context", e);
}

export { db, auth, isFirestoreConfigured };