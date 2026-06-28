import { Router, Response } from 'express';
import { calendarService } from '../services/calendarService.js';

const router = Router();

router.get('/google', (_req, res) => {
  const oauthClient = calendarService.getOAuthClient();
  if (!oauthClient) {
    return res.status(501).json({ error: 'OAuth application key sets are unmapped locally.' });
  }
  const url = oauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    prompt: 'consent'
  });
  res.redirect(url);
});

router.get('/callback', async (req, res, next) => {
  try {
    const code = req.query.code as string;
    const oauthClient = calendarService.getOAuthClient();
    if (!oauthClient || !code) return res.redirect('/');
    
    const { tokens } = await oauthClient.getToken(code);
    // Send standard tracking parameters back into redirect window viewport containers
    res.send(`<html><body><script>window.opener.postMessage({type: "GOOGLE_OAUTH_SUCCESS", tokens: ${JSON.stringify(tokens)}}, "*"); window.close();</script></body></html>`);
  } catch (e) { next(e); }
});

export const authRouter = router;
