import { AgentLog } from '../../types';
import { Terminal, ShieldAlert, Cpu, Calendar, Bell, Mic } from 'lucide-react';

export const ActivityLog = ({ logs }: { logs: AgentLog[] }) => {
  
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'subtasks_planned': return <Cpu size={12} className="text-nova-action" />;
      case 'priority_recomputed': return <Terminal size={12} className="text-nova-glow" />;
      case 'calendar_scheduled': return <Calendar size={12} className="text-orange-400" />;
      case 'reminder_drafted': return <Bell size={12} className="text-yellow-300" />;
      case 'escalation_sent': return <ShieldAlert size={12} className="text-nova-urgent" />;
      default: return <Mic size={12} className="text-nova-telemetry" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-[11px] bg-space-800/20">
      <div className="p-3 border-b border-space-700/60 bg-space-800/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-nova-action">
          <Terminal size={13} className="animate-pulse" />
          <span className="font-display font-semibold uppercase tracking-wider text-xs">Autonomous Execution Stream</span>
        </div>
        <span className="text-[9px] text-nova-telemetry bg-space-900 px-1.5 py-0.2 rounded border border-space-700/40">
          LIVE_STREAM
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 scroll-smooth">
        {logs.length === 0 ? (
          <div className="text-nova-telemetry/40 text-center pt-8 italic">
            Telemetry stream empty. Standby for cycle instantiation loop.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-2 bg-space-900/40 border border-space-700/30 rounded flex items-start gap-2.5 transition-all hover:bg-space-900/80">
              <div className="mt-0.5 p-1 bg-space-800 rounded border border-space-700/50 shrink-0">
                {getLogIcon(log.actionType)}
              </div>
              <div className="space-y-1 w-full min-w-0">
                <div className="flex justify-between items-center gap-2 text-[9px] text-nova-telemetry">
                  <span className="uppercase font-semibold text-nova-glow/70 truncate tracking-tight">
                    {log.actionType.replace('_', ' ')}
                  </span>
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
                <p className="text-nova-text font-body leading-relaxed text-xs break-words">
                  {log.message}
                </p>
                {log.taskTitle && (
                  <div className="text-[9px] bg-space-800 text-nova-telemetry/90 px-1 py-0.2 rounded inline-block max-w-full truncate border border-space-700/20">
                    OBJ: {log.taskTitle}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
