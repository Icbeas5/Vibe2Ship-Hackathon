import { Task } from '../../types';
import { TaskCard } from '../dashboard/TaskCard';
import { BarChart4, FolderHeart } from 'lucide-react';

interface SidebarProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (task: Task) => void;
  onToggleComplete: (id: string) => void;
}

export const Sidebar = ({ tasks, selectedTaskId, onSelectTask, onToggleComplete }: SidebarProps) => {
  const activeTasks = tasks.filter(t => !t.isCompleted);
  const criticalCount = activeTasks.filter(t => t.priorityTier === 'critical').length;
  
  return (
    <aside className="w-full md:w-72 border-r border-space-700/60 bg-space-800/40 flex flex-col shrink-0 overflow-hidden">
      
      {/* Visual Operational Stats Panel */}
      <div className="p-3 border-b border-space-700/60 bg-space-800/20 font-mono text-[10px]">
        <div className="flex items-center gap-1 text-nova-telemetry font-display font-medium uppercase tracking-wider mb-2">
          <BarChart4 size={12} />
          <span>Telemetry Status Brief</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-space-900/50 border border-space-700/40 p-2 rounded">
            <span className="text-nova-telemetry block text-[9px]">PENDING LOGS</span>
            <span className="text-sm font-bold font-display text-nova-text">{activeTasks.length}</span>
          </div>
          <div className={`border p-2 rounded transition-colors ${criticalCount > 0 ? 'bg-nova-urgent/5 border-nova-urgent/30 animate-pulse' : 'bg-space-900/50 border-space-700/40'}`}>
            <span className="text-nova-telemetry block text-[9px]">CRITICAL CORE</span>
            <span className={`text-sm font-bold font-display ${criticalCount > 0 ? 'text-nova-urgent' : 'text-nova-text'}`}>{criticalCount}</span>
          </div>
        </div>
      </div>

      {/* Task Telemetry Stream Feed Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-[10px] uppercase font-mono text-nova-telemetry tracking-wider font-semibold mb-1 flex items-center gap-1">
          <FolderHeart size={11} className="text-nova-action" />
          <span>Objective Stream Feed</span>
        </div>
        {activeTasks.length === 0 ? (
          <div className="text-nova-telemetry/40 text-center py-10 font-mono text-xs italic">
            All orbits clear.<br />System vector stable.
          </div>
        ) : (
          activeTasks
            .sort((a, b) => b.priorityScore - a.priorityScore)
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isSelected={task.id === selectedTaskId}
                onSelect={() => onSelectTask(task)}
                onToggleComplete={() => onToggleComplete(task.id)}
              />
            ))
        )}
      </div>

    </aside>
  );
};