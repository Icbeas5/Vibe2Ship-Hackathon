import { useState, useEffect, useRef } from 'react';

export const useVoiceRecognition = (onTranscriptComplete: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  // 🌟 ADDED: Track if the browser actually supports voice transcription
  const [isSupported, setIsSupported] = useState(true); 
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser capability
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition core not supported within this browser engine framework.");
      setIsSupported(false);
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
        recognition.abort(); 
        
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
    toggleListening,
    isSupported // 🌟 RETURN THE EXPECTED FLAG FOR YOUR COMPONENT
  };
};