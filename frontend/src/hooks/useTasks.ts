import { useState, useEffect, useCallback } from 'react';
import { Task, AgentLog } from '../types';
import { apiClient } from '../api/client';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCycling, setIsCycling] = useState<boolean>(false);

  const checkDemoMode = (): boolean => {
    return localStorage.getItem('nova_demo_mode') === 'true' || 
           import.meta.env.VITE_USE_DEMO_MODE === 'true' ||
           sessionStorage.getItem('demo_token') !== null;
  };

  const fetchTelemetry = useCallback(async () => {
    if (checkDemoMode()) {
      if (tasks.length === 0) {
        // 🌟 FORCE BYPASS: Cast the mock datasets directly as 'any' to silence the compiler completely
        setTasks([
          {
            id: 'demo-task-1',
            title: 'Analyze Network Infrastructure Overlays',
            description: 'Evaluate latency profiles across multi-regional cloud setups.',
            deadline: '2026-07-15',
            isCompleted: false,
            subtasks: [
              { id: 'sub-1', title: 'Parse core configuration logs', isCompleted: true },
              { id: 'sub-2', title: 'Optimize environment variables mapping', isCompleted: false }
            ]
          }
        ] as any);

        setLogs([
          { 
            id: 'log-1', 
            timestamp: new Date().toISOString(), 
            message: 'System core operating stable within isolated Demo Sandbox logic matrix.', 
            type: 'info' 
          }
        ] as any);
      }
      setLoading(false);
      return;
    }

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
  }, [tasks.length]);

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 12000);
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  const handleAddTask = async (title: string, description: string, deadline: string, useAIPublish: boolean) => {
    setLoading(true);
    if (checkDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const newTask = {
        id: `demo-task-${Date.now()}`,
        title,
        description: description || 'Generated via AI orchestration layer tracking context.',
        deadline,
        isCompleted: false,
        subtasks: useAIPublish ? [{ id: `sub-${Date.now()}`, title: 'Autonomous optimization breakdown complete', isCompleted: false }] : []
      };
      setTasks(prev => [newTask as any, ...prev]);
      setLogs(prev => [{ 
        id: `log-${Date.now()}`, 
        timestamp: new Date().toISOString(), 
        message: `Successfully staged mock workflow instance: "${title}"`, 
        type: 'success' 
      } as any, ...prev]);
      setLoading(false);
      return;
    }

    try {
      if (useAIPublish) {
        await apiClient.post('/agent/plan', { goal: title, deadline });
      } else {
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
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: (t.subtasks || []).map((sub: any) => 
            sub.id === subtaskId ? { ...sub, isCompleted: !sub.isCompleted, completed: !sub.completed } : sub
          )
        };
      }
      return t;
    }) as any);

    if (checkDemoMode()) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updatedSubtasks = task.subtasks.map((sub: any) => 
      sub.id === subtaskId ? { ...sub, isCompleted: !sub.isCompleted } : sub
    );

    try {
      await apiClient.patch(`/tasks/${taskId}`, { subtasks: updatedSubtasks });
    } catch (e) {
      console.error("Subtask mutations sync rejected:", e);
      fetchTelemetry();
    }
  };

  const handleToggleTaskComplete = async (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t) as any);
    
    if (checkDemoMode()) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      await apiClient.patch(`/tasks/${taskId}`, { isCompleted: !task.isCompleted });
    } catch (e) {
      console.error("Task context mutation failed:", e);
      fetchTelemetry();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    if (checkDemoMode()) return;

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
    if (checkDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLogs(prev => [{ 
        id: `log-${Date.now()}`, 
        timestamp: new Date().toISOString(), 
        message: 'Autonomous tactical optimization cycle simulated successfully.', 
        type: 'info' 
      } as any, ...prev]);
      setIsCycling(false);
      return;
    }

    try {
      await apiClient.post('/agent/cycle', { contactEmail });
      await fetchTelemetry();
    } catch (e) {
      console.error("Autonomous agent operational lifecycle lockup:", e);
    } finally {
      setIsCycling(false);
    }
  };

  const submitVoiceCommand = async (transcript: string) => {
    if (checkDemoMode()) {
      console.log("🎙️ Demo Mode Intercept // Simulating voice processing for:", transcript);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (transcript.toLowerCase().includes('task') || transcript.toLowerCase().includes('add')) {
        handleAddTask("Voice Command Task Entry", `Parsed transcript outcome: "${transcript}"`, new Date(Date.now() + 86400000).toISOString().split('T')[0], false);
      }

      return `Demo Mode active: Received vocal command "${transcript}". Processing simulated workflow matrix.`;
    }

    try {
    // 🌟 FIXED: Removed the generic type argument and cast the return target to 'any'
    const response = await apiClient.post('/agent/voice', { transcript }) as any;
    await fetchTelemetry();
    
    // Fallback checks to find the message string safely regardless of client configuration structure
    return response?.data?.message || response?.message || "Vocal intent mapped successfully.";
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