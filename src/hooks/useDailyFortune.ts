"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import type { FortuneRequest, FortuneResponse } from "@/types/api";

interface UseDailyFortuneReturn {
  fortune: FortuneResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchFortune: (request: FortuneRequest) => Promise<void>;
  reset: () => void;
}

export function useDailyFortune(): UseDailyFortuneReturn {
  const [fortune, setFortune] = useState<FortuneResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setFortune(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const fetchFortune = useCallback(async (request: FortuneRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.getDailyFortune(request);
      setFortune(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch fortune";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fortune, isLoading, error, fetchFortune, reset };
}
