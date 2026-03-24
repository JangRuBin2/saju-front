"use client";

import { useState, useCallback, useRef } from "react";
import { streamSajuReading } from "@/lib/sse-client";
import type { BirthInput, SajuCalculateResponse } from "@/types/api";

interface UseSajuReadingReturn {
  calculation: SajuCalculateResponse | null;
  text: string;
  isStreaming: boolean;
  isComplete: boolean;
  error: string | null;
  counselorId: string | null;
  startReading: (birthInput: BirthInput, counselorId?: string) => void;
  reset: () => void;
}

export function useSajuReading(): UseSajuReadingReturn {
  const [calculation, setCalculation] =
    useState<SajuCalculateResponse | null>(null);
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [counselorId, setCounselorId] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setCalculation(null);
    setText("");
    setIsStreaming(false);
    setIsComplete(false);
    setError(null);
    setCounselorId(null);
  }, []);

  const startReading = useCallback(
    (birthInput: BirthInput, selectedCounselorId?: string) => {
      reset();
      setIsStreaming(true);
      if (selectedCounselorId) setCounselorId(selectedCounselorId);

      const controller = streamSajuReading(
        { birth: birthInput, stream: true, counselor_id: selectedCounselorId },
        {
          onCalculation: (data) => {
            setCalculation(data);
          },
          onChunk: (chunk) => {
            setText((prev) => prev + chunk);
          },
          onComplete: () => {
            setIsStreaming(false);
            setIsComplete(true);
          },
          onError: (err) => {
            setIsStreaming(false);
            setError(err.message);
          },
        }
      );

      controllerRef.current = controller;
    },
    [reset]
  );

  return {
    calculation,
    text,
    isStreaming,
    isComplete,
    error,
    counselorId,
    startReading,
    reset,
  };
}
