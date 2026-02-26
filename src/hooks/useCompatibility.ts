"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import type { CompatibilityRequest, CompatibilityResponse } from "@/types/api";

interface UseCompatibilityReturn {
  result: CompatibilityResponse | null;
  isLoading: boolean;
  error: string | null;
  checkCompatibility: (request: CompatibilityRequest) => Promise<void>;
  reset: () => void;
}

export function useCompatibility(): UseCompatibilityReturn {
  const [result, setResult] = useState<CompatibilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const checkCompatibility = useCallback(
    async (request: CompatibilityRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiClient.getCompatibility(request);
        setResult(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to check compatibility";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { result, isLoading, error, checkCompatibility, reset };
}
