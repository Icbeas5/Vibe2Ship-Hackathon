import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { taskService } from '../services/taskService.js';
import { plannerAgent } from '../agents/plannerAgent.js';
import { voiceAgent } from '../agents/voiceAgent.js';
import { orchestrator } from '../agents/orchestrator.js';

const router = Router();

// Endpoint used by Cron or Cloud Scheduler - allows unauthenticated but checks system identity keys
router.post('/cycle', requireAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const contactEmail = req.body.contactEmail;
    await orchestrator.triggerAutonomousLifecycle(req.user!.uid, contactEmail);
    res.json({ success: true, message: 'Autonomous agent framework progression sync executed.' });
  } catch (e) { next(e); }
});

router.use(requireAuth);

router.post('/plan', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { goal, deadline } = req.body;
    const blueprint = await plannerAgent.planGoal(goal, deadline);
    
    const task = await taskService.createTask({
      ownerId: req.user!.uid,
      title: goal,
      description: blueprint.description,
      deadline: deadline,
      priorityScore: 70, // Baseline rating before core execution loops fire
      priorityTier: 'high',
      subtasks: blueprint.subtasks.map((s: any) => ({
        id: Math.random().toString(36).substring(2, 9),
        title: s.title,
        estimatedMinutes: s.estimatedMinutes,
        isCompleted: false
      })),
      isCompleted: false,
      createdAt: new Date().toISOString()
    });

    await taskService.appendAgentLog({
      ownerId: req.user!.uid,
      actionType: 'subtasks_planned',
      taskId: task.id,
      taskTitle: task.title,
      message: `Deconstructed objective into ${blueprint.subtasks.length} sub-node checkpoints.`
    });

    res.status(201).json(task);
  } catch (e) { next(e); }
});

router.post('/voice', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { command } = req.body;
    const interpretation = await voiceAgent.processCommand(command);

    if (interpretation.intent === 'create_task' && interpretation.params?.title) {
      await taskService.createTask({
        ownerId: req.user!.uid,
        title: interpretation.params.title,
        description: 'Vocal intent ingest proxy tracking parameter.',
        deadline: interpretation.params.deadline || new Date(Date.now() + 86400000).toISOString(),
        priorityScore: 50,
        priorityTier: 'medium',
        subtasks: [],
        isCompleted: false,
        createdAt: new Date().toISOString()
      });
    } else if (interpretation.intent === 'complete_task' && interpretation.params?.titleMatch) {
      const active = await taskService.listTasks(req.user!.uid);
      const match = active.find(t => t.title.toLowerCase().includes(interpretation.params.titleMatch.toLowerCase()));
      if (match) {
        await taskService.updateTask(match.id, { isCompleted: true });
      }
    }

    await taskService.appendAgentLog({
      ownerId: req.user!.uid,
      actionType: 'voice_command',
      message: `Vocal syntactical parsed: "${command}" -> INTENT: ${interpretation.intent}`
    });

    res.json({ message: interpretation.textFeedback });
  } catch (e) { next(e); }
});

router.get('/logs', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const entries = await taskService.listAgentLogs(req.user!.uid);
    res.json(entries);
  } catch (e) { next(e); }
});

export const agentRouter = router;
