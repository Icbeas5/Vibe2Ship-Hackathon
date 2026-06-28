import express from 'express';
import cors from 'cors';
import { env } from './utils/env.js';
import { logger } from './utils/logger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { tasksRouter } from './routes/tasks.js';
import { agentRouter } from './routes/agent.js';
import { authRouter } from './routes/auth.js';
import { orchestrator } from './agents/orchestrator.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(rateLimiter);

// Operational Route Hooks
app.use('/api/tasks', tasksRouter);
app.use('/api/agent', agentRouter);
app.use('/api/auth', authRouter);

app.get('/health', (_req, res) => {
  res.json({ systemStatus: 'PRODUCTION_ONLINE', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

// Production Automation Background Loop Layer
// Runs every 30 minutes to evaluate deadline trajectories and trigger agent interventions
const AUTONOMOUS_INTERVAL = 12 * 30 * 60 * 1000; 
setInterval(async () => {
  logger.info("PRODUCTION CORE // Launching scheduled multi-agent cycle scan...");
  try {
    // Automatically runs active optimization maps for your baseline operator identity
    await orchestrator.triggerAutonomousLifecycle('demo-omega-01', 'your-notification-email@domain.com');
  } catch (err) {
    logger.error("PRODUCTION CORE // Autonomous interval pipeline encountered exception:", err);
  }
}, AUTONOMOUS_INTERVAL);

const portNumber = parseInt(env.PORT, 10) || 5000;
app.listen(portNumber, '0.0.0.0', () => {
  logger.info(`NOVA PRODUCTION COMPILER // ENGINE RUNNING AT: http://0.0.0.0:${portNumber}`);
});