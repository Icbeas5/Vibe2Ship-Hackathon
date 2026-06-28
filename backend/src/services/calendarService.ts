import { google } from 'googleapis';
import { env } from '../utils/env.js';
import { logger } from '../utils/logger.js';

export const calendarService = {
  getOAuthClient() {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return null;
    return new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_REDIRECT_URI);
  },

  async createDeadlineEvent(refreshToken: string, title: string, deadlineIso: string, description: string) {
    const client = this.getOAuthClient();
    if (!client) {
      logger.warn("Google Calendar Client parameters unconfigured. Simulating successful calendar event hook generation.");
      return "https://calendar.google.com/mock-event-link";
    }
    
    client.setCredentials({ refresh_token: refreshToken });
    const calendar = google.calendar({ version: 'v3', auth: client });
    
    const endTime = new Date(new Date(deadlineIso).getTime() + 60 * 60 * 1000).toISOString();
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `NOVA CRITICAL CORE // ${title}`,
        description,
        start: { dateTime: deadlineIso, timeZone: 'UTC' },
        end: { dateTime: endTime, timeZone: 'UTC' },
        colorId: '11' // Distinct red urgency identifier code
      }
    });

    return response.data.htmlLink || '';
  }
};
