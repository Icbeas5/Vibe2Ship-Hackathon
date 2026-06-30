import { useState, useEffect, useCallback, useRef } from 'react';

export const useVoiceRecognition = (onTranscriptComplete?: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
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

      rec.onerror = (event: any) => {
        console.error("🎙️ Speech Recognition Engine Error:", event.error);
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        console.log("🎙️ Raw Voice Event Received:", event);
        
        // 🌟 EXHAUSTIVE AND SECURE EXTRACTION LAYER
        const rawTranscript = event.results?.[0]?.[0]?.transcript;
        
        // Block null, undefined, or empty string artifacts immediately
        if (rawTranscript === undefined || rawTranscript === null) {
          console.warn("⚠️ Blocked a raw undefined/null speech event frame.");
          return;
        }

        const cleanString = String(rawTranscript).trim();

        // Strict verification: Ensure it isn't empty or the literal word string "undefined"
        if (cleanString && cleanString !== "" && cleanString !== "undefined") {
          console.log("🎯 Validated Voice Payload:", cleanString);
          setTranscript(cleanString);
          
          if (onTranscriptComplete) {
            onTranscriptComplete(cleanString);
          }
        } else {
          console.warn("⚠️ Filtered out an invalid or blank voice transcript payload string.");
        }
      };

      recognitionRef.current = rec;
    }
  }, [onTranscriptComplete]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to boot audio pipeline stream node:", err);
      }
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    isSupported,
    toggleListening
  };
};