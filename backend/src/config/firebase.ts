import admin from 'firebase-admin';
import { env } from '../utils/env.js';
import { logger } from '../utils/logger.js';

let db: any = null;
let auth: any = null;
let isFirestoreConfigured = false;

try {
  let serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    // 🌟 SANITIZE STRING: Remove dangerous hidden newlines/formatting glitches before parsing
    const sanitizedJson = serviceAccountJson.trim().replace(/\n/g, '\\n');
    const serviceAccount = JSON.parse(sanitizedJson);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: env.FIREBASE_PROJECT_ID || serviceAccount.project_id
    });
    
    db = admin.firestore();
    auth = admin.auth();
    isFirestoreConfigured = true;
    logger.info("Firebase Administrative Suite cloud container initialized securely from environment string matrix.");

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
  // 🌟 THIS WILL PRINT THE EXACT SYNTAX ERROR IN YOUR RENDER LOGS IF IT FAILS
  logger.error("Failed to map cloud infrastructure container context:", e);
}

export { db, auth, isFirestoreConfigured };