import { useState } from 'react';
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
          <ActivityLog logs={logs} />
        </section>

      </div>

      {/* Full width bottom orchestration layout vocal frame */}
      <VoiceAssistant onSendCommand={submitVoiceCommand} />

      {/* Global Modals overlay frame structure */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      />

    </div>
  );
};
