import { Task, AgentLog } from '../types/index.js';
import { db, isFirestoreConfigured } from '../config/firebase.js';

// Fully thread-safe localized fallback mock state storage framework mapping memory references directly
const memoryTasks: Task[] = [];
const memoryLogs: AgentLog[] = [];

export const taskService = {
  async listTasks(ownerId: string): Promise<Task[]> {
    if (isFirestoreConfigured && db) {
      const snap = await db.collection('tasks').where('ownerId', '==', ownerId).get();
      return snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Task));
    }
    return memoryTasks.filter(t => t.ownerId === ownerId);
  },

  async getTask(id: string): Promise<Task | null> {
    if (isFirestoreConfigured && db) {
      const doc = await db.collection('tasks').doc(id).get();
      return doc.exists ? ({ id: doc.id, ...doc.data() } as Task) : null;
    }
    return memoryTasks.find(t => t.id === id) || null;
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const id = Math.random().toString(36).substring(2, 11);
    const newTask = { id, ...task } as Task;
    if (isFirestoreConfigured && db) {
      await db.collection('tasks').doc(id).set(task);
      return newTask;
    }
    memoryTasks.push(newTask);
    return newTask;
  },

  async updateTask(id: string, patch: Partial<Task>): Promise<void> {
    if (isFirestoreConfigured && db) {
      await db.collection('tasks').doc(id).update(patch);
      return;
    }
    const idx = memoryTasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      memoryTasks[idx] = { ...memoryTasks[idx], ...patch };
    }
  },

  async deleteTask(id: string): Promise<void> {
    if (isFirestoreConfigured && db) {
      await db.collection('tasks').doc(id).delete();
      return;
    }
    const idx = memoryTasks.findIndex(t => t.id === id);
    if (idx !== -1) memoryTasks.splice(idx, 1);
  },

  async appendAgentLog(log: Omit<AgentLog, 'id' | 'timestamp'>): Promise<AgentLog> {
    const id = Math.random().toString(36).substring(2, 11);
    const newLog = { id, timestamp: new Date().toISOString(), ...log } as AgentLog;
    if (isFirestoreConfigured && db) {
      await db.collection('agent_logs').doc(id).set(newLog);
      return newLog;
    }
    memoryLogs.unshift(newLog); // Push to front for telemetry readout velocity optimization
    return newLog;
  },

  async listAgentLogs(ownerId: string, limitCount = 30): Promise<AgentLog[]> {
    if (isFirestoreConfigured && db) {
      const snap = await db.collection('agent_logs')
        .where('ownerId', '==', ownerId)
        .orderBy('timestamp', 'desc')
        .limit(limitCount).get();
      return snap.docs.map((d: any) => d.data() as AgentLog);
    }
    return memoryLogs.filter(l => l.ownerId === ownerId).slice(0, limitCount);
  }
};
