"use client";

import { useState, useCallback } from "react";
import {
  getPetReadingAction,
  getPetCompatibilityAction,
  getPetYearlyFortuneAction,
  getPetAdoptionTimingAction,
} from "@/lib/server/actions";
import type {
  PetReadingResponse,
  PetCompatibilityResponse,
  SajuReadingResponse,
  PetReadingRequest,
  PetCompatibilityRequest,
  PetYearlyFortuneRequest,
  PetAdoptionTimingRequest,
} from "@/types/api";

type PetType = "reading" | "compatibility" | "yearly_fortune" | "adoption_timing";

type PetResult = PetReadingResponse | PetCompatibilityResponse | SajuReadingResponse;

interface UsePetReadingReturn {
  result: PetResult | null;
  isLoading: boolean;
  error: string | null;
  errorType: string | null;
  fetchReading: (
    type: PetType,
    request: PetReadingRequest | PetCompatibilityRequest | PetYearlyFortuneRequest | PetAdoptionTimingRequest
  ) => Promise<void>;
  reset: () => void;
}

export function usePetReading(): UsePetReadingReturn {
  const [result, setResult] = useState<PetResult | null>(null);
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
    async (
      type: PetType,
      request: PetReadingRequest | PetCompatibilityRequest | PetYearlyFortuneRequest | PetAdoptionTimingRequest
    ) => {
      setIsLoading(true);
      setError(null);
      setErrorType(null);
      try {
        let actionResult;
        switch (type) {
          case "reading":
            actionResult = await getPetReadingAction(request as PetReadingRequest);
            break;
          case "compatibility":
            actionResult = await getPetCompatibilityAction(request as PetCompatibilityRequest);
            break;
          case "yearly_fortune":
            actionResult = await getPetYearlyFortuneAction(request as PetYearlyFortuneRequest);
            break;
          case "adoption_timing":
            actionResult = await getPetAdoptionTimingAction(request as PetAdoptionTimingRequest);
            break;
        }
        if (actionResult.success) {
          setResult(actionResult.data);
        } else {
          setError(actionResult.error);
          setErrorType(actionResult.errorType);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch pet reading";
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
