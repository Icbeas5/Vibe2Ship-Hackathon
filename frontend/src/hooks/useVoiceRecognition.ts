import { useState, useEffect, useRef } from 'react';

export const useVoiceRecognition = (onTranscriptComplete: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API safely inside container context
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition core not supported within this browser engine framework.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);
      if (onTranscriptComplete) {
        onTranscriptComplete(resultText);
      }
    };

    rec.onerror = (event: any) => {
      console.error("Speech engine pipeline error frame:", event.error);
      setIsListening(false);
    };

    recognitionRef.current = rec;
  }, [onTranscriptComplete]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    try {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        // 🌟 SAFETY LOCKOUT: Stop any dangling process instances before trying to initiate boot
        recognition.abort(); 
        
        // Brief timeout ensures the native audio hardware engine completely registers the clean slate state
        setTimeout(() => {
          try {
            recognition.start();
          } catch (innerError) {
            console.warn("Prevented recursive initialization collision:", innerError);
          }
        }, 50);
      }
    } catch (e) {
      console.error("Failed to map control state modifications to native browser runtime layer:", e);
    }
  };

  return {
    isListening,
    transcript,
    toggleListening
  };
};