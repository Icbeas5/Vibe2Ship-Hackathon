import { useState, useEffect, useRef } from 'react';

export const useVoiceRecognition = (onTranscriptFinalized: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Web Speech API vocal synthesis mapping is unavailable in this client platform framework.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    rec.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalText = event.results[i][0].transcript;
          setTranscript(finalText);
          onTranscriptFinalized(finalText);
        } else {
          interim += event.results[i][0].transcript;
          setTranscript(interim);
        }
      }
    };

    rec.onerror = (e: any) => {
      console.error("Speech framework visual parsing node error:", e);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
  }, [onTranscriptFinalized]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice interface engine missing or blocked in native container setup.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return { isListening, transcript, toggleListening, isSupported: !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) };
};
