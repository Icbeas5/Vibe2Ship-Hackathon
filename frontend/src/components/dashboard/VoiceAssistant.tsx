import { useState, useCallback } from 'react'; // 🌟 UPDATED: Imported useCallback
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { Mic, MicOff, Send, Cpu } from 'lucide-react';

export const VoiceAssistant = ({ onSendCommand }: { onSendCommand: (txt: string) => Promise<string> }) => {
  const [input, setInput] = useState('');
  const [responseLog, setResponseLog] = useState<string>('SYSTEM ONLINE: Standing by for telemetry vocal ingestion pipeline...');
  const [processing, setProcessing] = useState(false);

  const dispatchCommand = async (commandString: string) => {
    if (!commandString.trim()) return;
    setProcessing(true);
    setResponseLog(`PARSING DIRECTIVE: "${commandString}"...`);
    
    const resultText = await onSendCommand(commandString);
    setResponseLog(`NOVA ENGINE // ${resultText}`);
    setInput('');
    setProcessing(false);
  };

  const handleSpeechFinalized = useCallback(async (transcriptText: any) => {
    // 🌟 DETECT AND FIX: If the payload is an event object or the literal string "undefined", safely extract it
    let cleanText = "";
    
    if (typeof transcriptText === 'string' && transcriptText !== "undefined") {
      cleanText = transcriptText;
    } else if (transcriptText && typeof transcriptText === 'object') {
      cleanText = transcriptText.transcript || transcriptText.text || "";
    }

    // Completely drop empty or broken leaks
    if (!cleanText || !cleanText.trim() || cleanText === "undefined") {
      console.warn("⚠️ Intercepted broken 'undefined' voice string leak.");
      return;
    }

    setInput(cleanText);
    await dispatchCommand(cleanText);
  }, [onSendCommand]);

  const { isListening, toggleListening, isSupported } = useVoiceRecognition(handleSpeechFinalized);

  return (
    <div className="w-full bg-space-800 border-t border-space-700 p-3 flex flex-col md:flex-row items-center justify-between gap-3 font-mono">
      <div className="flex items-center gap-2 w-full md:w-auto max-w-xl">
        <Cpu size={14} className={`text-nova-glow ${processing ? 'animate-spin' : ''}`} />
        <div className="text-[10px] text-nova-glow bg-space-900/60 border border-space-700/50 px-3 py-1 rounded max-w-xs md:max-w-md truncate">
          {responseLog}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-1/2 justify-end">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={isListening ? "Listening natively to active audio pipeline..." : "Transmit syntax core instruction... (e.g., 'create task buy groceries by tonight')"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && dispatchCommand(input)}
            className="w-full bg-space-900 border border-space-700 text-nova-text rounded pl-3 pr-8 py-1.5 text-xs focus:outline-none focus:border-nova-glow font-body placeholder:text-nova-telemetry/40"
          />
          {isSupported && (
            <button
              onClick={toggleListening}
              className={`absolute right-2 top-1.5 transition-colors focus:outline-none ${isListening ? 'text-nova-urgent animate-pulse' : 'text-nova-telemetry hover:text-nova-text'}`}
              title="Vocal Ingestion Node Toggle"
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
          )}
        </div>
        <button
          onClick={() => dispatchCommand(input)}
          disabled={!input.trim()}
          className="p-1.5 rounded bg-space-700 hover:bg-space-600 text-nova-glow border border-space-600 disabled:opacity-40 transition-all focus:outline-none"
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
};