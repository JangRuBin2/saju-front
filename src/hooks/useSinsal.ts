"use client";

import { useState, useCallback } from "react";
import { getSinsalAction } from "@/lib/server/actions";
import type { BirthInput, SajuReadingResponse } from "@/types/api";

interface UseSinsalReturn {
  result: SajuReadingResponse | null;
  isLoading: boolean;
  error: string | null;
  errorType: string | null;
  analyzeSinsal: (birth: BirthInput) => Promise<void>;
  reset: () => void;
}

export function useSinsal(): UseSinsalReturn {
  const [result, setResult] = useState<SajuReadingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setIsLoading(false);
    setError(null);
    setErrorType(null);
  }, []);

  const analyzeSinsal = useCallback(async (birth: BirthInput) => {
    setIsLoading(true);
    setError(null);
    setErrorType(null);
    try {
      const actionResult = await getSinsalAction(birth);
      if (actionResult.success) {
        setResult(actionResult.data);
      } else {
        setError(actionResult.error);
        setErrorType(actionResult.errorType);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to analyze sinsal";
      setError(message);
      setErrorType("server_error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, errorType, analyzeSinsal, reset };
}
