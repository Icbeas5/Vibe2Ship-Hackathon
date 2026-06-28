import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || '5000',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/callback',
};

// Rigorous system safeguard check vectors
if (!env.GEMINI_API_KEY) {
  console.warn("WARNING // CRITICAL EXCEPTION: GEMINI_API_KEY is currently unmapped. Structural Agent models will operate on local mock logic fallbacks.");
}
