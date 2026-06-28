export type PriorityTier = 'critical' | 'high' | 'medium' | 'low';

export interface SubTask {
  id: string;
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priorityScore: number; // Computed 0-100 score
  priorityTier: PriorityTier;
  priorityReasoning?: string;
  subtasks: SubTask[];
  isCompleted: boolean;
  createdAt: string;
  lastNudgeTime?: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  actionType: 'subtasks_planned' | 'priority_recomputed' | 'reminder_drafted' | 'calendar_scheduled' | 'escalation_sent' | 'voice_command';
  taskId?: string;
  taskTitle?: string;
  message: string;
}
