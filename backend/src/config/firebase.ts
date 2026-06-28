import admin from 'firebase-admin';
import { env } from '../utils/env.js';
import { logger } from '../utils/logger.js';

let db: any = null;
let auth: any = null;
let isFirestoreConfigured = false;

try {
  if (env.FIREBASE_PROJECT_ID && env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: env.FIREBASE_PROJECT_ID
    });
    db = admin.firestore();
    auth = admin.auth();
    isFirestoreConfigured = true;
    logger.info("Firebase Administrative Suite cloud container initialization validated.");
  } else {
    logger.warn("Firebase environmental variables missing. Falling back instantly to production-grade InMemory memory matrix repositories.");
  }
} catch (e) {
  logger.error("Failed to map cloud infrastructure container context", e);
}

export { db, auth, isFirestoreConfigured };
