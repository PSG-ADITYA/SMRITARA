import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  recognitionLanguage: string;
  setRecognitionLanguage: (lang: string) => void;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(initialLang: string = 'en-US'): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [recognitionLanguage, setRecognitionLanguage] = useState<string>(initialLang);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = recognitionLanguage;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          let currentFinal = '';
          let currentInterim = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentFinal += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (currentFinal) {
            setTranscript((prev) => (prev ? `${prev} ${currentFinal}` : currentFinal));
          }
          setInterimTranscript(currentInterim);
        };

        recognition.onerror = (event: any) => {
          if (event.error === 'no-speech') {
            // Silence detected, harmless
            return;
          }
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setError('Microphone permission was denied. Please allow microphone access in your browser settings.');
          } else if (event.error === 'network') {
            setError('Speech recognition network error. Please check your connection or use keyboard input.');
          } else {
            setError(`Speech recognition note: ${event.error || 'Unavailable'}. Standard text input is always available.`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };

        recognitionRef.current = recognition;
      } catch (err: any) {
        setIsSupported(false);
        setError('Speech recognition could not be initialized in this browser.');
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [recognitionLanguage]);

  const startListening = useCallback(() => {
    setError(null);
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in this browser environment.');
      return;
    }
    try {
      recognitionRef.current.lang = recognitionLanguage;
      recognitionRef.current.start();
    } catch (e: any) {
      // If already started or aborting
      if (e.name !== 'InvalidStateError') {
        setError('Unable to start audio recording. Standard text input is ready.');
      }
    }
  }, [recognitionLanguage]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    recognitionLanguage,
    setRecognitionLanguage,
    startListening,
    stopListening,
    resetTranscript,
  };
}
