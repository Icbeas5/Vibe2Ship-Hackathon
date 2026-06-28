import { ai } from '../config/gemini.js';
import { env } from '../utils/env.js';

export const plannerAgent = {
  async planGoal(goal: string, deadline: string): Promise<{ subtasks: { title: string; estimatedMinutes: number }[]; description: string }> {
    if (!env.GEMINI_API_KEY) {
      return {
        description: "Bypassed Core. Generated standard fail-safe atomic checklist templates.",
        subtasks: [
          { title: "Initialize blueprint framework context nodes", estimatedMinutes: 30 },
          { title: "Deploy logic structural validation streams", estimatedMinutes: 60 }
        ]
      };
    }

    const prompt = `You are the Strategic Planner Agent within the 'Nova' autonomous productivity system. 
Your core responsibility is to translate a high-level goal into a granular, structured action plan consisting of subtasks.

Goal: "${goal}"
Target System Deadline: ${deadline}

Deconstruct this goal into a list of specific, logical, sequential subtasks necessary to achieve success prior to the deadline. Assign a reasonable time allocation (in minutes) to each item. Produce a descriptive contextual summary.

You must respond with valid JSON matching this schema:
{
  "description": "text summary of approach strategy",
  "subtasks": [
    { "title": "subtask action string", "estimatedMinutes": 30 }
  ]
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
