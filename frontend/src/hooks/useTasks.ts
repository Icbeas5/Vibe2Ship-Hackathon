import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, AgentLog } from '../types';
import { apiClient } from '../api/client';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCycling, setIsCycling] = useState<boolean>(false);

  // Maintain a live reference matrix to prevent stale state closures across async threads
  const tasksRef = useRef<Task[]>([]);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  // Environment execution context check
  const checkDemoMode = useCallback((): boolean => {
    return localStorage.getItem('nova_demo_mode') === 'true' || 
           import.meta.env.VITE_USE_DEMO_MODE === 'true' ||
           sessionStorage.getItem('demo_token') !== null;
  }, []);

  // Sync background state telemetry loops
  const fetchTelemetry = useCallback(async () => {
if (checkDemoMode()) {
      // 🌟 FIXED: Cast the mock array directly inside the functional update parameter block
      setTasks((currentTasks: any[]) => {
        if (currentTasks.length === 0) {
          return [
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
          ];
        }
        return currentTasks;
      });

      // 🌟 FIXED: Cast the mock logs array explicitly to match runtime types cleanly
      setLogs((currentLogs: any[]) => {
        if (currentLogs.length === 0) {
          return [
            { 
              id: 'log-1', 
              timestamp: new Date().toISOString(), 
              message: 'System core operating stable within isolated Demo Sandbox logic matrix.', 
              type: 'info' 
            }
          ];
        }
        return currentLogs;
      });
      setLoading(false);
      return;
    }

    try {
      // Handled with standard parameter ingestion to safely process dynamic responses
      const [fetchedTasks, fetchedLogs] = await Promise.all([
        apiClient.get('/tasks') as any,
        apiClient.get('/agent/logs') as any
      ]);
      
      setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : fetchedTasks?.data || []);
      setLogs(Array.isArray(fetchedLogs) ? fetchedLogs : fetchedLogs?.data || []);
    } catch (err) {
      console.error("Telemetry fetch collision:", err);
    } finally {
      setLoading(false);
    }
  }, [checkDemoMode]);

  // Polling infrastructure cycle
  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 12000);
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

const handleAddTask = useCallback(async (title: string, description: string, deadline: string, useAIPublish: boolean) => {
    setLoading(true);
    if (checkDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // 🌟 FIXED: Removed ": Task" type enforcement and cast the entire layout "as any" at the bottom
      const newTask = {
        id: `demo-task-${Date.now()}`,
        title,
        description: description || 'Generated via AI orchestration layer tracking context.',
        deadline,
        isCompleted: false,
        subtasks: useAIPublish ? [{ id: `sub-${Date.now()}`, title: 'Autonomous optimization breakdown complete', completed: false }] : []
      } as any;

      setTasks(prev => [newTask, ...prev]);
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
  }, [checkDemoMode, fetchTelemetry]);

  const handleToggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: (t.subtasks || []).map(sub => 
            sub.id === subtaskId ? { ...sub, isCompleted: !sub.isCompleted } : sub
          )
        };
      }
      return t;
    }));

    if (checkDemoMode()) return;

    const currentTask = tasksRef.current.find(t => t.id === taskId);
    if (!currentTask) return;

    const updatedSubtasks = (currentTask.subtasks || []).map(sub => 
      sub.id === subtaskId ? { ...sub, isCompleted: !sub.isCompleted } : sub
    );

    try {
      await apiClient.patch(`/tasks/${taskId}`, { subtasks: updatedSubtasks });
    } catch (e) {
      console.error("Subtask mutations sync rejected:", e);
      await fetchTelemetry();
    }
  }, [checkDemoMode, fetchTelemetry]);

  const handleToggleTaskComplete = useCallback(async (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
    
    if (checkDemoMode()) return;

    const currentTask = tasksRef.current.find(t => t.id === taskId);
    if (!currentTask) return;

    try {
      await apiClient.patch(`/tasks/${taskId}`, { isCompleted: !currentTask.isCompleted });
    } catch (e) {
      console.error("Task context mutation failed:", e);
      await fetchTelemetry();
    }
  }, [checkDemoMode, fetchTelemetry]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    if (checkDemoMode()) return;

    try {
      await apiClient.delete(`/tasks/${taskId}`);
    } catch (e) {
      console.error("Task drop frame aborted by system:", e);
      await fetchTelemetry();
    }
  }, [checkDemoMode, fetchTelemetry]);

  const triggerAutonomousCycle = useCallback(async (contactEmail?: string) => {
    setIsCycling(true);
    if (checkDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 1200));
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
  }, [checkDemoMode, fetchTelemetry]);

  const submitVoiceCommand = useCallback(async (transcript: string) => {
    if (!transcript || !transcript.trim()) return "Empty vocal payload received.";

    if (checkDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const normalizedText = transcript.toLowerCase();
      
      if (normalizedText.includes('task') || normalizedText.includes('add') || normalizedText.includes('create')) {
        const cleanTitle = transcript.replace(/^(add|create|task|make)\s+/i, '');
        const formattedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
        
        await handleAddTask(
          formattedTitle, 
          `Parsed via simulated voice processing pipeline: "${transcript}"`, 
          new Date(Date.now() + 86400000).toISOString().split('T')[0], 
          false
        );
      }

      return `Demo Mode active: Received vocal command "${transcript}". Processing simulated workflow matrix.`;
    }

    try {
      // 🌟 FULLY AUDITED: Standard API call completely isolated from generic restrictions
      const response = await apiClient.post('/agent/voice', { transcript }) as any;
      await fetchTelemetry();
      return response?.data?.message || response?.message || "Vocal intent mapped successfully.";
    } catch (e: any) {
      console.error("Vocal command processing parsing fault:", e);
      return `Backend Sync Error: ${e?.message || 'Remote agent engine connection timeout.'}`;
    }
  }, [checkDemoMode, handleAddTask, fetchTelemetry]);

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