import { useEffect, useRef, useState } from "react";

export const useVoiceControl = ({ onCommand, onError }) => {
  const recognitionRef = useRef(null);
  const commandHandlerRef = useRef(onCommand);
  const errorHandlerRef = useRef(onError);
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    commandHandlerRef.current = onCommand;
    errorHandlerRef.current = onError;
  }, [onCommand, onError]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      errorHandlerRef.current?.(event.error || "Voice recognition failed.");
    };

    recognition.onresult = (event) => {
      const spokenText = event.results?.[0]?.[0]?.transcript?.trim() || "";
      setTranscript(spokenText);
      commandHandlerRef.current?.(spokenText);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current || isListening) {
      return;
    }

    setTranscript("");

    try {
      recognitionRef.current.start();
    } catch (error) {
      errorHandlerRef.current?.(error?.message || "Voice recognition could not start.");
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch (error) {
      errorHandlerRef.current?.(error?.message || "Voice recognition could not stop cleanly.");
    }
  };

  return {
    isSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
  };
};
