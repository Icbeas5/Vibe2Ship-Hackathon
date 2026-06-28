import { ai } from '../config/gemini.js';
import { env } from '../utils/env.js';

export const voiceAgent = {
  async processCommand(commandString: string): Promise<{ intent: 'create_task' | 'complete_task' | 'query_status' | 'unknown'; params: any; textFeedback: string }> {
    if (!env.GEMINI_API_KEY) {
      return {
        intent: 'create_task',
        params: { title: "Voice capture sample directive", deadline: new Date(Date.now() + 86400000).toISOString() },
        textFeedback: "Standalone simulation processing voice pipeline parameters locally."
      };
    }

    const prompt = `You are the Voice Processing Natural Language Understanding unit for Nova.
Analyze the user's spoken or typed utterance syntax string to parse their operational intent.

User Vocal Input String: "${commandString}"

Map this command to one of these system actions:
1. create_task (User wants to make a new objective. Extract 'title' and extrapolate an ISO 'deadline' timestamp string relative to right now: ${new Date().toISOString()})
2. complete_task (User wants to close an objective. Extract the target phrase string into 'titleMatch')
3. query_status (User is requesting a system telemetry update)
4. unknown (Command syntax is outside bounds)

Formulate a concise, conversational natural confirmation feedback phrase acknowledging the parsed intention.

Return valid JSON matching this schema layout:
{
  "intent": "create_task" | "complete_task" | "query_status" | "unknown",
  "params": { "title": "string", "deadline": "ISO-string", "titleMatch": "string" },
  "textFeedback": "Conversational reply string acknowledging the operation."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text?.trim() || '{}');
  }
};
