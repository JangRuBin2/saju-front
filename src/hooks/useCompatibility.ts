"use client";

import { useState, useCallback } from "react";
import { getCompatibilityAction } from "@/lib/server/actions";
import type { CompatibilityRequest, CompatibilityResponse } from "@/types/api";

interface UseCompatibilityReturn {
  result: CompatibilityResponse | null;
  isLoading: boolean;
  error: string | null;
  errorType: string | null;
  checkCompatibility: (request: CompatibilityRequest) => Promise<void>;
  reset: () => void;
}

export function useCompatibility(): UseCompatibilityReturn {
  const [result, setResult] = useState<CompatibilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setIsLoading(false);
    setError(null);
    setErrorType(null);
  }, []);

  const checkCompatibility = useCallback(
    async (request: CompatibilityRequest) => {
      setIsLoading(true);
      setError(null);
      setErrorType(null);
      try {
        const actionResult = await getCompatibilityAction(request);
        if (actionResult.success) {
          setResult(actionResult.data);
        } else {
          setError(actionResult.error);
          setErrorType(actionResult.errorType);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to check compatibility";
        setError(message);
        setErrorType("server_error");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { result, isLoading, error, errorType, checkCompatibility, reset };
}
