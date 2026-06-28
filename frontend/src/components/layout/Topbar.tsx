import { Cpu, Plus, LogOut } from 'lucide-react';

interface TopbarProps {
  userDisplayName: string;
  isCycling: boolean;
  onAddTaskClick: () => void;
  onTriggerCycle: () => void;
  onLogout: () => void;
}

export const Topbar = ({ userDisplayName, isCycling, onAddTaskClick, onTriggerCycle, onLogout }: TopbarProps) => {
  return (
    <header className="h-14 bg-space-800 border-b border-space-700/60 px-4 flex items-center justify-between font-display shrink-0 z-20 relative">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded bg-gradient-to-tr from-nova-action to-nova-glow flex items-center justify-center font-bold text-space-900 shadow-glow-cyan text-sm tracking-tighter">
          N
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wider text-nova-text uppercase">Nova</h1>
          <p className="text-[9px] font-mono tracking-tight text-nova-glow/70 -mt-0.5">AUTONOMOUS MISSION CONTROL</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Trigger Autonomous Core Cycle */}
        <button
          onClick={onTriggerCycle}
          disabled={isCycling}
          className={`px-3 py-1.5 rounded bg-space-900 border border-space-700 hover:border-nova-action text-xs font-mono text-nova-action flex items-center gap-1.5 transition-all focus:outline-none ${isCycling ? 'animate-pulse opacity-60' : ''}`}
          title="Force-Fire Real-world Action Synthesis Lifecycle"
        >
          <Cpu size={12} className={isCycling ? 'animate-spin' : ''} />
          <span>{isCycling ? 'SYNCHRONIZING...' : 'RUN CYCLE'}</span>
        </button>

        {/* Add Task Trigger */}
        <button
          onClick={onAddTaskClick}
          className="px-3 py-1.5 rounded bg-nova-glow text-space-900 font-semibold text-xs tracking-wide flex items-center gap-1 transition-transform hover:scale-[1.02] focus:outline-none shadow-glow-cyan"
        >
          <Plus size={13} strokeWidth={2.5} />
          <span>ADD DIRECTIVE</span>
        </button>

        {/* User Identity context section */}
        <div className="h-6 w-px bg-space-700/60 hidden md:block" />
        
        <div className="hidden md:flex items-center gap-2 text-right">
          <div className="font-mono text-[10px]">
            <span className="text-nova-telemetry block leading-none">OPERATOR</span>
            <span className="text-nova-text font-medium text-xs font-body block mt-0.5">{userDisplayName}</span>
          </div>
          <button 
            onClick={onLogout}
            className="p-1.5 text-nova-telemetry hover:text-nova-urgent hover:bg-space-700/30 rounded transition-colors focus:outline-none"
            title="Terminate Core Session"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};