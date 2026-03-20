"use client";

import { useState, useCallback } from "react";
import {
  getMarriageTimingAction,
  getMarriageLifeForecastAction,
  getMarriageFinanceAction,
  getMarriageAuspiciousDatesAction,
} from "@/lib/server/actions";
import type {
  MarriageTimingResponse,
  MarriageTimingRequest,
  MarriageLifeForecastRequest,
  MarriageFinanceRequest,
  MarriageAuspiciousDatesRequest,
} from "@/types/api";

type MarriageType = "timing" | "life_forecast" | "finance" | "auspicious_dates";

type MarriageRequest =
  | MarriageTimingRequest
  | MarriageLifeForecastRequest
  | MarriageFinanceRequest
  | MarriageAuspiciousDatesRequest;

interface UseMarriageReadingReturn {
  result: MarriageTimingResponse | null;
  isLoading: boolean;
  error: string | null;
  errorType: string | null;
  fetchReading: (type: MarriageType, request: MarriageRequest) => Promise<void>;
  reset: () => void;
}

const ACTION_MAP = {
  timing: getMarriageTimingAction,
  life_forecast: getMarriageLifeForecastAction,
  finance: getMarriageFinanceAction,
  auspicious_dates: getMarriageAuspiciousDatesAction,
} as const;

export function useMarriageReading(): UseMarriageReadingReturn {
  const [result, setResult] = useState<MarriageTimingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setIsLoading(false);
    setError(null);
    setErrorType(null);
  }, []);

  const fetchReading = useCallback(
    async (type: MarriageType, request: MarriageRequest) => {
      setIsLoading(true);
      setError(null);
      setErrorType(null);
      try {
        const action = ACTION_MAP[type];
        const actionResult = await action(request as never);
        if (actionResult.success) {
          setResult(actionResult.data);
        } else {
          setError(actionResult.error);
          setErrorType(actionResult.errorType);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch marriage reading";
        setError(message);
        setErrorType("server_error");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { result, isLoading, error, errorType, fetchReading, reset };
}
