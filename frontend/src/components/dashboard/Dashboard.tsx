import { useState, useCallback, useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types';
import { Topbar } from '../layout/Topbar';
import { Sidebar } from '../layout/Sidebar';
import { TaskGalaxy } from '../three/TaskGalaxy';
import { ActivityLog } from './ActivityLog';
import { TaskDetail } from './TaskDetail';
import { AddTaskModal } from './AddTaskModal';
import { VoiceAssistant } from './VoiceAssistant';

export const Dashboard = ({ userSession, onSignOut }: { userSession: any, onSignOut: () => void }) => {
  const {
    tasks,
    logs,
    isCycling,
    handleAddTask,
    handleToggleSubtask,
    handleToggleTaskComplete,
    handleDeleteTask,
    triggerAutonomousCycle,
    submitVoiceCommand
  } = useTasks();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-refresh reference context hooks if mutated inside children
  const refreshedSelectedTask = tasks.find(t => t.id === selectedTask?.id) || null;

  // 🌟 EMERGENCY CLEANER: Filter out any faulty data rows containing "undefined" from rendering on screen
  const sanitizedLogs = useMemo(() => {
    return logs.filter(log => {
      if (!log || !log.message) return false;
      const msg = String(log.message).toLowerCase();
      return !msg.includes('undefined') && !msg.includes('"undefined"');
    });
  }, [logs]);

  // 🌟 SECURE INTERCEPTOR: Clean speech strings right here at the dashboard boundary level
  const handleProtectedVoiceCommand = useCallback(async (txt: string): Promise<string> => {
    const checkValue = String(txt).trim().toLowerCase();
    
    if (!txt || checkValue === "" || checkValue === "undefined") {
      console.warn("🛡️ Dashboard blocked a leaking 'undefined' audio processing trigger thread.");
      return "System pipeline validation error: Vocal stream captured empty or unresolved audio frequencies.";
    }
    
    return await submitVoiceCommand(txt);
  }, [submitVoiceCommand]);

  return (
    <div className="h-screen w-screen bg-space-900 flex flex-col overflow-hidden text-nova-text selection:bg-nova-glow/20">
      
      <Topbar
        userDisplayName={userSession.displayName || 'Operator'}
        isCycling={isCycling}
        onAddTaskClick={() => setIsModalOpen(true)}
        onTriggerCycle={() => triggerAutonomousCycle(userSession.email || undefined)}
        onLogout={onSignOut}
      />

      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative overflow-hidden">
        
        {/* Left Hand: Directive telemetry streams feed */}
        <Sidebar
          tasks={tasks}
          selectedTaskId={refreshedSelectedTask?.id || null}
          onSelectTask={(task) => setSelectedTask(task)}
          onToggleComplete={(id) => handleToggleTaskComplete(id)}
        />

        {/* Center Canvas: WebGL 3D Gravitational Object Grid */}
        <main className="flex-1 relative bg-space-900 border-r border-space-700/60 min-h-[300px] md:min-h-0">
          <TaskGalaxy
            tasks={tasks}
            selectedTaskId={refreshedSelectedTask?.id || null}
            onSelectTask={(task) => setSelectedTask(task)}
          />

          {/* Floating contextual evaluation checklist overlay */}
          {refreshedSelectedTask && (
            <TaskDetail
              task={refreshedSelectedTask}
              onClose={() => setSelectedTask(null)}
              onToggleSubtask={(subId) => handleToggleSubtask(refreshedSelectedTask.id, subId)}
              onToggleComplete={() => handleToggleTaskComplete(refreshedSelectedTask.id)}
              onDelete={() => {
                handleDeleteTask(refreshedSelectedTask.id);
                setSelectedTask(null);
              }}
            />
          )}
        </main>

        {/* Right Hand Side: Autonomous trace logs stream */}
        <section className="w-full md:w-80 shrink-0 h-48 md:h-full border-t md:border-t-0 border-space-700/60">
          {/* 🌟 FIXED: Passing the clean sanitized logs collection array to block error display bugs */}
          <ActivityLog logs={sanitizedLogs} />
        </section>

      </div>

      {/* Full width bottom orchestration layout vocal frame */}
      {/* 🌟 FIXED: Passing the secure command pipeline interceptor wrapper instead of the raw hook function */}
      <VoiceAssistant onSendCommand={handleProtectedVoiceCommand} />

      {/* Global Modals overlay frame structure */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      />

    </div>
  );
};