// Real Web Speech API implementation for speech-to-text functionality

// Define interfaces for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

// Extend the Window interface
declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export class SpeechService {
  private static instance: SpeechService;
  private callbacks: {
    onResult?: (transcript: string) => void;
    onEnd?: () => void;
    onStart?: () => void;
    onError?: (error: string) => void;
  };
  private isListening: boolean = false;
  private recognition: SpeechRecognition | null = null;
  
  private constructor() {
    this.callbacks = {};
    this.initializeRecognition();
  }
  
  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }
  
  private initializeRecognition(): void {
    if (this.isSupported()) {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      
      if (this.recognition) {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        
        this.recognition.onstart = () => {
          this.isListening = true;
          if (this.callbacks.onStart) this.callbacks.onStart();
        };
        
        this.recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          const fullTranscript = finalTranscript || interimTranscript;
          if (this.callbacks.onResult && fullTranscript.trim()) {
            this.callbacks.onResult(fullTranscript.trim());
          }
          
          // Important: when speech recognition ends a phrase, restart it to keep listening
          if (finalTranscript && this.recognition && !this.recognition.continuous) {
            this.recognition.stop();
            setTimeout(() => {
              if (this.isListening && this.recognition) {
                this.recognition.start();
              }
            }, 100);
          }
        };
        
        this.recognition.onend = () => {
          this.isListening = false;
          if (this.callbacks.onEnd) this.callbacks.onEnd();
        };
        
        this.recognition.onerror = (event) => {
          this.isListening = false;
          const errorMessage = `Speech recognition error: ${event.error}`;
          console.error(errorMessage);
          if (this.callbacks.onError) this.callbacks.onError(errorMessage);
        };
      }
    }
  }
  
  public setCallbacks(callbacks: {
    onResult?: (transcript: string) => void;
    onEnd?: () => void;
    onStart?: () => void;
    onError?: (error: string) => void;
  }): void {
    this.callbacks = callbacks;
  }
  
  public start(): void {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        if (this.callbacks.onError) {
          this.callbacks.onError('Failed to start speech recognition');
        }
      }
    }
  }
  
  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
    this.isListening = false;
  }
  
  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
}
