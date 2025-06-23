import { useState, useEffect, useCallback } from 'react';
import { SpeechService } from '../services/speech-service';

interface UseSpeechToTextProps {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
}

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  hasRecognitionSupport: boolean;
}

export const useSpeechToText = ({
  continuous = false,
  interimResults = true,
  lang = 'en-US',
  onResult,
  onEnd
}: UseSpeechToTextProps = {}): UseSpeechToTextReturn => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState<boolean>(false);
  
  // Initialize the speech service
  useEffect(() => {
    const speechService = SpeechService.getInstance();
    setHasRecognitionSupport(speechService.isSupported());
    
    speechService.setCallbacks({
      onResult: (result) => {
        setTranscript(result);
        if (onResult) onResult(result);
      },
      onEnd: () => {
        setIsListening(false);
        if (onEnd) onEnd();
      },
      onStart: () => {
        setIsListening(true);
      },
      onError: (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      }
    });
    
    return () => {
      if (isListening) {
        speechService.stop();
      }
    };
  }, [onResult, onEnd]);
  
  const startListening = useCallback(() => {
    if (!isListening) {
      const speechService = SpeechService.getInstance();
      speechService.start();
    }
  }, [isListening]);
  
  const stopListening = useCallback(() => {
    if (isListening) {
      const speechService = SpeechService.getInstance();
      speechService.stop();
    }
  }, [isListening]);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport
  };
};
