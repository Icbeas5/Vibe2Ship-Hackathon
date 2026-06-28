import { useState } from 'react';
import { X, Sparkles, Terminal } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string, deadline: string, useAIPublish: boolean) => void;
}

export const AddTaskModal = ({ isOpen, onClose, onAdd }: AddTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [useAI, setUseAI] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline) return;
    onAdd(title, description, deadline, useAI);
    setTitle('');
    setDescription('');
    setDeadline('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-space-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-space-800 border border-space-700 rounded-lg overflow-hidden shadow-2xl">
        
        {/* Banner header frame */}
        <div className="bg-space-700/40 p-4 border-b border-space-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal size={15} className="text-nova-glow" />
            <h3 className="font-display font-semibold text-sm text-nova-text uppercase tracking-wider">
              Initialize New Operational Objective
            </h3>
          </div>
          <button onClick={onClose} className="text-nova-telemetry hover:text-nova-text transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase text-nova-telemetry mb-1">Objective Directive / High-Level Goal</label>
            <input
              type="text"
              required
              placeholder="e.g., Pitch presentation for secondary seed venture round"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-space-900 border border-space-700 rounded p-2 text-xs text-nova-text font-body focus:outline-none focus:border-nova-glow"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-nova-telemetry mb-1">Context Parameters (Optional)</label>
            <textarea
              placeholder="Inject background payload instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-space-900 border border-space-700 rounded p-2 text-xs text-nova-text font-body focus:outline-none focus:border-nova-glow resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-nova-telemetry mb-1">Absolute Target Deadline Matrix</label>
            <input
              type="datetime-local"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-space-900 border border-space-700 rounded p-2 text-xs text-nova-text font-mono focus:outline-none focus:border-nova-glow"
            />
          </div>

          {/* AI Orchestrator Selector Framework */}
          <div 
            onClick={() => setUseAI(!useAI)}
            className={`p-3 rounded border cursor-pointer transition-all flex items-center justify-between ${
              useAI 
                ? 'bg-nova-action/5 border-nova-action shadow-sm' 
                : 'bg-space-900 border-space-700 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className={useAI ? 'text-nova-action' : 'text-nova-telemetry'} />
              <div>
                <h4 className="text-xs font-medium text-nova-text">Activate Gemini Strategic Planner Agent</h4>
                <p className="text-[10px] text-nova-telemetry">Autonomously break down objective goals into atomic subtasks</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={useAI} 
              readOnly 
              className="accent-nova-action h-3.5 w-3.5 rounded border-space-700"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-space-700 text-xs text-nova-telemetry hover:text-nova-text hover:bg-space-700/20 font-medium transition-colors"
            >
              Abort
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-nova-glow text-space-900 font-display font-semibold text-xs tracking-wide hover:opacity-90 transition-opacity flex Skinner-glow"
            >
              Deploy Directive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
