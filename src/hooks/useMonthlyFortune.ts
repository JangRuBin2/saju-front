"use client";

import { useState, useCallback } from "react";
import { getMonthlyFortuneAction } from "@/lib/server/actions";
import type { FortuneRequest, FortuneResponse } from "@/types/api";

interface UseMonthlyFortuneReturn {
  fortune: FortuneResponse | null;
  isLoading: boolean;
  error: string | null;
  errorType: string | null;
  fetchFortune: (request: FortuneRequest) => Promise<void>;
  reset: () => void;
}

export function useMonthlyFortune(): UseMonthlyFortuneReturn {
  const [fortune, setFortune] = useState<FortuneResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const reset = useCallback(() => {
    setFortune(null);
    setIsLoading(false);
    setError(null);
    setErrorType(null);
  }, []);

  const fetchFortune = useCallback(async (request: FortuneRequest) => {
    setIsLoading(true);
    setError(null);
    setErrorType(null);
    try {
      const result = await getMonthlyFortuneAction(request);
      if (result.success) {
        setFortune(result.data);
      } else {
        setError(result.error);
        setErrorType(result.errorType);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch monthly fortune";
      setError(message);
      setErrorType("server_error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fortune, isLoading, error, errorType, fetchFortune, reset };
}
