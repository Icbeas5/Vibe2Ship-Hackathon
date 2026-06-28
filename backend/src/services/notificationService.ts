import { logger } from '../utils/logger.js';

export const notificationService = {
  async dispatchEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    // Modular mock notification system. Easily linked with SendGrid / Resend / AWS SES
    logger.info(`NOTIFY MATRIX TRANSIT // Sending alert payload to [${to}] // SUBJECT: ${subject}`);
    logger.info(`NOTIFY MATRIX PAYLOAD:
${htmlContent}`);
    return true;
  }
};
