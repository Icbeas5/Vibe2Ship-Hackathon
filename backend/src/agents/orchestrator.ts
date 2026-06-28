import { taskService } from '../services/taskService.js';
import { priorityAgent } from './priorityAgent.js';
import { actionAgent } from './actionAgent.js';
import { notificationService } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

export const orchestrator = {
  async triggerAutonomousLifecycle(ownerId: string, contactEmail?: string) {
    logger.info(`AUTONOMOUS ENGINE INITIALIZED // Syncing infrastructure for user ID: [${ownerId}]`);

    // Phase 1: Pull state data metrics
    const tasks = await taskService.listTasks(ownerId);
    const incompleteTasks = tasks.filter(t => !t.isCompleted);

    if (incompleteTasks.length === 0) {
      logger.info("System loop stable. All parameters resting cleanly within parameters.");
      return;
    }

    // Phase 2: Compute priority criteria scores using Gemini
    logger.info("Engaging priority verification matrices...");
    try {
      const priorityAssessments = await priorityAgent.recomputePriorityMatrix(incompleteTasks);
      
      for (const assessment of priorityAssessments) {
        await taskService.updateTask(assessment.id, {
          priorityScore: assessment.score,
          priorityTier: assessment.tier,
          priorityReasoning: assessment.reasoning
        });
      }
      
      await taskService.appendAgentLog({
        ownerId,
        actionType: 'priority_recomputed',
        message: `Recalculated active vector parameters for ${priorityAssessments.length} objectives.`
      });
    } catch (err) {
      logger.error("Prioritization pipeline disruption intercepted:", err);
    }

    // Phase 3: Evaluate urgent action options for critical tasks
    const reloadedTasks = await taskService.listTasks(ownerId);
    const urgentTasks = reloadedTasks.filter(t => !t.isCompleted && (t.priorityTier === 'critical' || t.priorityTier === 'high'));

    logger.info(`Action analysis sub-agent processing ${urgentTasks.length} urgent nodes...`);
    for (const task of urgentTasks) {
      // Throttle intervention hooks to avoid overwhelming user alerts
      const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;
      if (task.lastNudgeTime && new Date(task.lastNudgeTime).getTime() > threeHoursAgo) {
        continue; 
      }

      try {
        const decision = await actionAgent.decideAndExecute(task, contactEmail);
        
        if (decision.actionTaken === 'no_action') continue;

        // Map abstract choice to concrete infrastructure execution
        if (decision.actionTaken === 'send_escalation' && contactEmail) {
          await notificationService.dispatchEmail(
            contactEmail,
            `NOVA SYSTEM CORE URGENT ESCALATION // Objective: ${task.title}`,
            `<p>Critical timeline stress detected. <strong>Action Required:</strong> ${decision.summary}</p>`
          );
          await taskService.appendAgentLog({
            ownerId,
            actionType: 'escalation_sent',
            taskId: task.id,
            taskTitle: task.title,
            message: `Dispatched high-priority email alert to [${contactEmail}]: ${decision.summary}`
          });
        } else if (decision.actionTaken === 'draft_reminder') {
          await taskService.appendAgentLog({
            ownerId,
            actionType: 'reminder_drafted',
            taskId: task.id,
            taskTitle: task.title,
            message: `Created urgent notification prompt: ${decision.summary}`
          });
        }

        // Tag time checkpoint log array trace to avoid loop overlapping
        await taskService.updateTask(task.id, { lastNudgeTime: new Date().toISOString() });

      } catch (err) {
        logger.error(`Failed tool integration run on task target ${task.id}:`, err);
      }
    }

    logger.info("Autonomous execution tracking baseline lifecycle cycle loop complete.");
  }
};
