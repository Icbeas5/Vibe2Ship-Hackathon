import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { taskService } from '../services/taskService.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const list = await taskService.listTasks(req.user!.uid);
    res.json(list);
  } catch (e) { next(e); }
});

router.post('/', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const payload = {
      ownerId: req.user!.uid,
      title: req.body.title,
      description: req.body.description || '',
      deadline: req.body.deadline,
      priorityScore: req.body.priorityScore || 40,
      priorityTier: req.body.priorityTier || 'medium',
      subtasks: req.body.subtasks || [],
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    const task = await taskService.createTask(payload);
    res.status(201).json(task);
  } catch (e) { next(e); }
});

router.patch('/:id', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    await taskService.updateTask(req.params.id, req.body);
    res.json({ message: 'Sync operations updated successfully.' });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.json({ message: 'Task entry completely dropped.' });
  } catch (e) { next(e); }
});

export const tasksRouter = router;
