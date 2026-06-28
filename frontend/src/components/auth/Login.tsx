import { useState } from 'react';
import { loginWithGoogle } from '../../api/firebase';
import { Shield, KeyRound, Sparkles } from 'lucide-react';

export const Login = ({ onDemoBypass }: { onDemoBypass: () => void }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (e: any) {
      alert(e.message || "Authentication vector rejected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4 font-body relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(#1f2647_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-nova-glow/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm bg-space-800 border border-space-700 rounded-xl p-6 shadow-2xl relative z-10 text-center space-y-6">
        
        <div className="space-y-2">
          <div className="mx-auto h-16 w-16 rounded-xl bg-space-900/80 border border-nova-glow/30 flex items-center justify-center text-nova-glow shadow-[0_0_20px_rgba(6,182,212,0.15)] group hover:border-nova-glow/60 transition-all duration-300">
            <svg 
  viewBox="0 0 100 100" 
  className="w-10 h-10 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
  fill="none" 
  stroke="currentColor" 
  strokeWidth="2.5" 
  strokeLinecap="round" 
  strokeLinejoin="round"
>
  {/* Outer Tech Nova-Burst Pattern */}
  <path d="M50 12 L58 32 L78 24 L68 42 L88 50 L68 58 L78 76 L58 68 L50 88 L42 68 L22 76 L32 58 L12 50 L32 42 L22 24 L42 32 Z" className="opacity-40 animate-pulse" strokeWidth="1.5" />
  
  {/* Clean Interlocking 'N' Vector Core */}
  <path d="M30 68 V32 L54 68 V32" strokeWidth="3" />
  
  {/* Accent Chevron line highlighting the 'V' within the structure */}
  <path d="M44 53 L54 68 L66 42" strokeWidth="3" className="text-nova-action" />
</svg>
          </div>

          <h2 className="font-display font-bold text-xl text-nova-text uppercase tracking-widest mt-4 flex items-center justify-center gap-1.5">
            <Sparkles size={16} className="text-nova-glow animate-pulse" />
            <span>NOVA ARCHITECTURE</span>
          </h2>
          <p className="text-xs text-nova-telemetry font-mono">
            Autonomous Proactive Productivity Engine
          </p>
        </div>

        <div className="p-3 bg-space-900/50 border border-space-700/50 rounded text-left text-[11px] font-mono leading-relaxed text-nova-telemetry">
          <span className="text-nova-glow flex items-center gap-1 font-semibold mb-1 uppercase tracking-tight">
            <Shield size={12} /> Hackathon Sandbox Parameters
          </span>
          This framework leverages the Google GenAI SDK for orchestrating intelligent Multi-Agent task systems.
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2 rounded bg-gradient-to-r from-space-700 to-space-600 hover:from-space-600 hover:to-space-500 border border-space-600 text-nova-text text-xs font-semibold tracking-wide shadow transition-all focus:outline-none disabled:opacity-50"
          >
            {loading ? 'INITIALIZING INTERACTION...' : 'AUTHENTICATE VIA GOOGLE CLOUD'}
          </button>
          
          <div className="relative flex py-1 items-center font-mono text-[9px] text-nova-telemetry/40">
            <div className="flex-grow border-t border-space-700/40"></div>
            <span className="flex-shrink mx-2">OR</span>
            <div className="flex-grow border-t border-space-700/40"></div>
          </div>

          <button
            onClick={() => {
              localStorage.setItem('nova_local_demo_override', 'true');
              onDemoBypass();
              window.location.reload();
            }}
            className="w-full py-2 rounded bg-nova-action/10 hover:bg-nova-action/20 border border-nova-action/30 text-nova-action text-xs font-mono tracking-wider transition-all focus:outline-none flex items-center justify-center gap-1.5"
          >
            <KeyRound size={12} />
            <span>LOCAL OVERRIDE DEMO MODE</span>
          </button>
        </div>

        <div className="text-[9px] text-nova-telemetry/30 font-mono">
          VIBE2SHIP CHALLENGE CORE SYSTEM CORE // PHASE_2026
        </div>

      </div>
    </div>
  );
};