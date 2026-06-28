import { ai } from '../config/gemini.js';
import { env } from '../utils/env.js';
import { Task } from '../types/index.js';

export const actionAgent = {
  async decideAndExecute(task: Task, contextEmail?: string): Promise<{ actionTaken: string; summary: string }> {
    if (!env.GEMINI_API_KEY) {
      return { actionTaken: 'no_action', summary: "System running in standalone isolated environment loop." };
    }

    const prompt = `You are the Active Autonomous Action Agent within Nova. You handle real-world task progression support via custom tool vectors.

Task context block under evaluation:
- Title: ${task.title}
- Description: ${task.description}
- Urgency Tier: ${task.priorityTier}
- Absolute Deadline: ${task.deadline}
- Calculated Score: ${task.priorityScore}
- Target Recipient Address: ${contextEmail || 'unmapped@nova.internal'}

Determine which automated administrative helper function to call to maximize chances of hitting this deadline.
Available Options:
1. draft_reminder: Drafts an urgent prompt alerting the operator to take immediate action.
2. send_escalation: Dispatches a high-priority advisory to the target recipient address regarding an imminent threat to an objective.
3. schedule_calendar_event: Automatically blocks time on their personal schedule.
4. no_action: No structural tool call is required for this node right now.

Select the single most contextually appropriate utility. You must return valid JSON matching this schema:
{
  "action": "draft_reminder" | "send_escalation" | "schedule_calendar_event" | "no_action",
  "message": "The body content text of the alert message or calendar context description payload"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return {
      actionTaken: parsed.action || 'no_action',
      summary: parsed.message || 'Maintained standard track baseline positioning.'
    };
  }
};
