import { Task } from '../../types';
import { PriorityBadge } from './PriorityBadge';
import { X, CheckSquare, Square, Trash2, Calendar, Sparkles } from 'lucide-react';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onToggleSubtask: (subId: string) => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}

export const TaskDetail = ({ task, onClose, onToggleSubtask, onToggleComplete, onDelete }: TaskDetailProps) => {
  const completedSubtasksCount = task.subtasks?.filter(s => s.isCompleted).length || 0;
  const totalSubtasksCount = task.subtasks?.length || 0;

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-space-800/95 border border-space-700/80 backdrop-blur-md rounded-lg shadow-2xl p-4 flex flex-col md:flex-row gap-4 items-start z-10 transition-all duration-300">
      
      {/* Detail Core Left block */}
      <div className="flex-1 space-y-2 w-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <PriorityBadge tier={task.priorityTier} />
              <span className="text-[10px] font-mono text-nova-telemetry flex items-center gap-1">
                <Calendar size={11} />
                {new Date(task.deadline).toLocaleString()}
              </span>
            </div>
            <h3 className={`font-display font-semibold text-sm text-nova-text ${task.isCompleted ? 'line-through opacity-40' : ''}`}>
              {task.title}
            </h3>
          </div>
          <button onClick={onClose} className="md:hidden text-nova-telemetry hover:text-nova-text">
            <X size={16} />
          </button>
        </div>

        {task.description && (
          <p className="text-xs text-nova-telemetry font-body leading-relaxed border-l-2 border-space-700 pl-2">
            {task.description}
          </p>
        )}

        {task.priorityReasoning && (
          <div className="bg-space-900/60 rounded p-2 border border-space-700/40 text-[11px]">
            <div className="flex items-center gap-1 text-nova-glow font-mono font-medium mb-0.5">
              <Sparkles size={11} />
              <span>AI CRITERIA STRATEGY SCORE ANALYSIS</span>
            </div>
            <p className="text-nova-telemetry/90 font-body leading-snug">
              {task.priorityReasoning}
            </p>
          </div>
        )}
      </div>

      {/* Subtasks Middle Checklist Layer */}
      <div className="w-full md:w-64 shrink-0 border-t md:border-t-0 md:border-l border-space-700/50 pt-3 md:pt-0 md:pl-4 space-y-2">
        <div className="flex justify-between items-center font-mono text-[10px] uppercase text-nova-telemetry tracking-wider">
          <span>Atomic Execution Matrix</span>
          <span className="text-nova-glow font-semibold">{completedSubtasksCount}/{totalSubtasksCount}</span>
        </div>
        
        <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
          {totalSubtasksCount === 0 ? (
            <div className="text-[10px] text-nova-telemetry/40 italic py-2">No sub-matrix nodes plotted.</div>
          ) : (
            task.subtasks.map((sub) => (
              <div 
                key={sub.id}
                onClick={() => onToggleSubtask(sub.id)}
                className="flex items-center gap-2 p-1.5 rounded bg-space-900/40 border border-space-700/30 cursor-pointer hover:border-space-600 hover:bg-space-900 transition-all text-left"
              >
                <button className="text-nova-telemetry hover:text-nova-glow shrink-0 focus:outline-none">
                  {sub.isCompleted ? <CheckSquare size={12} className="text-nova-glow" /> : <Square size={12} />}
                </button>
                <span className={`text-xs truncate text-nova-text ${sub.isCompleted ? 'line-through opacity-40' : ''}`}>
                  {sub.title}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Suite Utility buttons Right Side */}
      <div className="flex md:flex-col justify-end gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 border-space-700/50 pt-3 md:pt-0">
        <button
          onClick={onToggleComplete}
          className={`px-3 py-1.5 rounded text-xs font-mono w-full md:w-28 text-center transition-colors border ${
            task.isCompleted
              ? 'bg-space-700/30 text-nova-telemetry border-space-600'
              : 'bg-nova-glow/10 text-nova-glow border-nova-glow/30 hover:bg-nova-glow/20'
          }`}
        >
          {task.isCompleted ? 'REOPEN' : 'RESOLVE'}
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1.5 rounded bg-transparent text-nova-telemetry border border-space-700 hover:border-nova-urgent hover:text-nova-urgent text-xs font-mono transition-colors flex items-center justify-center gap-1 shrink-0"
          title="Drop Task Direct"
        >
          <Trash2 size={12} />
          <span className="md:hidden">DROP</span>
        </button>
        <button onClick={onClose} className="hidden md:flex items-center justify-center p-1.5 rounded border border-space-700 text-nova-telemetry hover:text-nova-text hover:bg-space-700/50 transition-all">
          <X size={13} />
        </button>
      </div>

    </div>
  );
};
