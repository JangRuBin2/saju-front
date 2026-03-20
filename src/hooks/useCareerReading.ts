"use client";

import { useState, useCallback } from "react";
import {
  getCareerTransitionAction,
  getCareerStayOrGoAction,
  getCareerStartupAction,
  getCareerBurnoutAction,
} from "@/lib/server/actions";
import type {
  SajuReadingResponse,
  CareerTransitionRequest,
  CareerStayOrGoRequest,
  CareerStartupRequest,
  CareerBurnoutRequest,
} from "@/types/api";

type CareerType = "transition" | "stay_or_go" | "startup" | "burnout";

type CareerRequest =
  | CareerTransitionRequest
  | CareerStayOrGoRequest
  | CareerStartupRequest
  | CareerBurnoutRequest;

interface UseCareerReadingReturn {
  reading: SajuReadingResponse | null;
  isLoading: boolean;
  error: string | null;
  errorType: string | null;
  fetchReading: (type: CareerType, request: CareerRequest) => Promise<void>;
  reset: () => void;
}

const ACTION_MAP = {
  transition: getCareerTransitionAction,
  stay_or_go: getCareerStayOrGoAction,
  startup: getCareerStartupAction,
  burnout: getCareerBurnoutAction,
} as const;

export function useCareerReading(): UseCareerReadingReturn {
  const [reading, setReading] = useState<SajuReadingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const reset = useCallback(() => {
    setReading(null);
    setIsLoading(false);
    setError(null);
    setErrorType(null);
  }, []);

  const fetchReading = useCallback(
    async (type: CareerType, request: CareerRequest) => {
      setIsLoading(true);
      setError(null);
      setErrorType(null);
      try {
        const action = ACTION_MAP[type];
        const result = await action(request as never);
        if (result.success) {
          setReading(result.data);
        } else {
          setError(result.error);
          setErrorType(result.errorType);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch career reading";
        setError(message);
        setErrorType("server_error");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { reading, isLoading, error, errorType, fetchReading, reset };
}
