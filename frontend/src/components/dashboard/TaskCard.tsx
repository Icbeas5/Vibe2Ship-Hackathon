import { Task } from '../../types';
import { PriorityBadge } from './PriorityBadge';
import { CheckCircle2, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
  onToggleComplete: () => void;
}

export const TaskCard = ({ task, isSelected, onSelect, onToggleComplete }: TaskCardProps) => {
  const getRemainingTimeStr = (deadlineStr: string) => {
    const hours = (new Date(deadlineStr).getTime() - new Date().getTime()) / (1000 * 60 * 60);
    if (hours < 0) return 'OVERDUE';
    if (hours < 24) return `${Math.floor(hours)}h left`;
    return `${Math.floor(hours / 24)}d left`;
  };

  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded border text-left cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-space-700/50 border-nova-glow shadow-glow-cyan' 
          : 'bg-space-800/40 border-space-700/40 hover:border-space-600 hover:bg-space-800/80'
      } ${task.isCompleted ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="font-display font-medium text-xs truncate text-nova-text max-w-[160px]">
          {task.title}
        </h4>
        <PriorityBadge tier={task.priorityTier} />
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-nova-telemetry">
        <div className="flex items-center gap-1">
          <Clock size={11} className={task.priorityTier === 'critical' && !task.isCompleted ? 'text-nova-urgent animate-pulse' : ''} />
          <span>{getRemainingTimeStr(task.deadline)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] px-1 py-0.2 bg-space-900 rounded border border-space-700/50">
            TS_{task.priorityScore}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
            className="text-nova-telemetry hover:text-nova-glow transition-colors focus:outline-none"
          >
            <CheckCircle2 size={13} className={task.isCompleted ? 'text-nova-glow' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};
