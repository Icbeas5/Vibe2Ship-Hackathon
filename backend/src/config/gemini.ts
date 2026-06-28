import { GoogleGenAI } from '@google/genai';
import { env } from '../utils/env.js';

// Production Google GenAI structural Client Singleton node
export const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY || "mock-api-key-bypass-active"
});
