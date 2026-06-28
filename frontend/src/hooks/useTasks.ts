import { useState, useEffect, useCallback } from 'react';
import { Task, AgentLog } from '../types';
import { apiClient } from '../api/client';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCycling, setIsCycling] = useState<boolean>(false);

  const fetchTelemetry = useCallback(async () => {
    try {
      const [fetchedTasks, fetchedLogs] = await Promise.all([
        apiClient.get('/tasks'),
        apiClient.get('/agent/logs')
      ]);
      setTasks(fetchedTasks);
      setLogs(fetchedLogs);
    } catch (err) {
      console.error("Telemetry fetch collision:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 12000); // Poll telemetry framework every 12 seconds
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  const handleAddTask = async (title: string, description: string, deadline: string, useAIPublish: boolean) => {
    setLoading(true);
    try {
      if (useAIPublish) {
        // Calls Gemini-Powered structural breakdown pipeline
        await apiClient.post('/agent/plan', { goal: title, deadline });
      } else {
        // Direct storage pipeline injection
        await apiClient.post('/tasks', { title, description, deadline });
      }
      await fetchTelemetry();
    } catch (e) {
      console.error("Task compilation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedSubtasks = task.subtasks.map(sub => 
      sub.id === subtaskId ? { ...sub, isCompleted: !sub.isCompleted } : sub
    );
    
    // Optimistic UI state assignment
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, subtasks: updatedSubtasks } : t));

    try {
      await apiClient.patch(`/tasks/${taskId}`, { subtasks: updatedSubtasks });
    } catch (e) {
      console.error("Subtask mutations sync rejected:", e);
      fetchTelemetry(); // Revert on failure
    }
  };

  const handleToggleTaskComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
    try {
      await apiClient.patch(`/tasks/${taskId}`, { isCompleted: !task.isCompleted });
    } catch (e) {
      console.error("Task context mutation failed:", e);
      fetchTelemetry();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      await fetchTelemetry();
    } catch (e) {
      console.error("Task drop frame aborted by system:", e);
      fetchTelemetry();
    }
  };

  const triggerAutonomousCycle = async (contactEmail?: string) => {
    setIsCycling(true);
    try {
      await apiClient.post('/agent/cycle', { contactEmail });
      await fetchTelemetry();
    } catch (e) {
      console.error("Autonomous agent operational lifecycle lockup:", e);
    } finally {
      setIsCycling(false);
    }
  };

  const submitVoiceCommand = async (command: string) => {
    try {
      const response = await apiClient.post('/agent/voice', { command });
      await fetchTelemetry();
      return response.message;
    } catch (e) {
      console.error("Vocal command processing parsing fault:", e);
      return "Critical payload processing failure.";
    }
  };

  return {
    tasks,
    logs,
    loading,
    isCycling,
    handleAddTask,
    handleToggleSubtask,
    handleToggleTaskComplete,
    handleDeleteTask,
    triggerAutonomousCycle,
    submitVoiceCommand,
    refreshTelemetry: fetchTelemetry
  };
};
