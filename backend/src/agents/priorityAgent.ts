import { ai } from '../config/gemini.js';
import { env } from '../utils/env.js';
import { Task } from '../types/index.js';

export const priorityAgent = {
  async recomputePriorityMatrix(tasks: Task[]): Promise<{ id: string; score: number; tier: 'critical' | 'high' | 'medium' | 'low'; reasoning: string }[]> {
    if (tasks.length === 0) return [];
    if (!env.GEMINI_API_KEY) {
      return tasks.map(t => ({ id: t.id, score: 50, tier: 'medium', reasoning: "System baseline fixed default score mapping." }));
    }

    const simpleTaskList = tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      deadline: t.deadline,
      subtasksCount: t.subtasks?.length || 0,
      completedSubtasks: t.subtasks?.filter(s => s.isCompleted).length || 0
    }));

    const prompt = `You are the Critical Assessment Priority Agent within Nova. Your task is to calculate an algorithmic impact priority matrix for all user active goals.

Current Timestamp baseline context: ${new Date().toISOString()}

Active Telemetry Payload Tasks:
${JSON.stringify(simpleTaskList, null, 2)}

Evaluate every task on a severity score vector from 0 to 100.
Consider closeness to deadline, completion percentages, complexity, and overall task description urgency.
Classify each task into one of these four operational tiers based on the calculated score:
- critical (Score 85-100: Extreme deadline pressure, immediate intervention required)
- high (Score 65-84: Substantial timeline stress)
- medium (Score 35-64: Standard operational progression)
- low (Score 0-34: No short-term structural pressure)

Provide a short, professional analytical logic reasoning string detailing the calculated evaluation criteria for each node.

You must respond with valid JSON matching this schema array:
[
  { "id": "task_id_here", "score": 92, "tier": "critical", "reasoning": "Context analytical statement..." }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text?.trim() || '[]');
  }
};
