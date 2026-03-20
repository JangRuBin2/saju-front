"use server";

import { auth } from "@/lib/auth";
import { checkTicket, consumePayment } from "./usage-limiter";
import * as apiServer from "./api-server-client";
import type {
  BirthInput,
  FortuneRequest,
  CompatibilityRequest,
  SajuCalculateResponse,
  SajuReadingResponse,
  FortuneResponse,
  CompatibilityResponse,
  PetReadingRequest,
  PetReadingResponse,
  PetCompatibilityRequest,
  PetCompatibilityResponse,
  PetYearlyFortuneRequest,
  PetAdoptionTimingRequest,
  CareerTransitionRequest,
  CareerStayOrGoRequest,
  CareerStartupRequest,
  CareerBurnoutRequest,
  MarriageTimingRequest,
  MarriageTimingResponse,
  MarriageLifeForecastRequest,
  MarriageFinanceRequest,
  MarriageAuspiciousDatesRequest,
} from "@/types/api";
import type { ActionResult } from "@/lib/errors";

const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

async function withTicketCheck<T>(
  readingTypeCode: string,
  fn: (userId: string, readingType: string) => Promise<T>
): Promise<ActionResult<T>> {
  if (isTestMode) {
    try {
      const data = await fn("test-user", readingTypeCode);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Server error",
        errorType: "server_error",
      };
    }
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      error: "Login required",
      errorType: "auth_required",
    };
  }

  const { allowed, paymentId } = await checkTicket(userId, readingTypeCode);
  if (!allowed) {
    return {
      success: false,
      error: `Ticket required for ${readingTypeCode}`,
      errorType: "ticket_required",
    };
  }

  try {
    const data = await fn(userId, readingTypeCode);
    if (paymentId) {
      await consumePayment(paymentId);
    }
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Server error",
      errorType: "server_error",
    };
  }
}

export async function calculateSajuAction(
  birth: BirthInput,
  readingType: string = "saju_reading"
): Promise<ActionResult<SajuCalculateResponse>> {
  return withTicketCheck(readingType, (userId, rt) =>
    apiServer.calculateSaju(birth, userId, rt)
  );
}

export async function getDailyFortuneAction(
  request: FortuneRequest
): Promise<ActionResult<FortuneResponse>> {
  return withTicketCheck("daily_fortune", (userId, rt) =>
    apiServer.getDailyFortune(request, userId, rt)
  );
}

export async function getMonthlyFortuneAction(
  request: FortuneRequest
): Promise<ActionResult<FortuneResponse>> {
  return withTicketCheck("monthly_fortune", (userId, rt) =>
    apiServer.getMonthlyFortune(request, userId, rt)
  );
}

export async function getCompatibilityAction(
  request: CompatibilityRequest
): Promise<ActionResult<CompatibilityResponse>> {
  return withTicketCheck("compatibility", (userId, rt) =>
    apiServer.getCompatibility(request, userId, rt)
  );
}

export async function getSinsalAction(
  birth: BirthInput
): Promise<ActionResult<SajuReadingResponse>> {
  return withTicketCheck("sinsal", (userId, rt) =>
    apiServer.getSinsal(birth, userId, rt)
  );
}

// --- Pet ---

export async function getPetReadingAction(
  request: PetReadingRequest
): Promise<ActionResult<PetReadingResponse>> {
  return withTicketCheck("pet_reading", (userId, rt) =>
    apiServer.getPetReading(request, userId, rt)
  );
}

export async function getPetCompatibilityAction(
  request: PetCompatibilityRequest
): Promise<ActionResult<PetCompatibilityResponse>> {
  return withTicketCheck("pet_compatibility", (userId, rt) =>
    apiServer.getPetCompatibility(request, userId, rt)
  );
}

export async function getPetYearlyFortuneAction(
  request: PetYearlyFortuneRequest
): Promise<ActionResult<PetReadingResponse>> {
  return withTicketCheck("pet_yearly_fortune", (userId, rt) =>
    apiServer.getPetYearlyFortune(request, userId, rt)
  );
}

export async function getPetAdoptionTimingAction(
  request: PetAdoptionTimingRequest
): Promise<ActionResult<SajuReadingResponse>> {
  return withTicketCheck("pet_adoption_timing", (userId, rt) =>
    apiServer.getPetAdoptionTiming(request, userId, rt)
  );
}

// --- Career ---

export async function getCareerTransitionAction(
  request: CareerTransitionRequest
): Promise<ActionResult<SajuReadingResponse>> {
  return withTicketCheck("career_transition", (userId, rt) =>
    apiServer.getCareerTransition(request, userId, rt)
  );
}

export async function getCareerStayOrGoAction(
  request: CareerStayOrGoRequest
): Promise<ActionResult<SajuReadingResponse>> {
  return withTicketCheck("career_stay_or_go", (userId, rt) =>
    apiServer.getCareerStayOrGo(request, userId, rt)
  );
}

export async function getCareerStartupAction(
  request: CareerStartupRequest
): Promise<ActionResult<SajuReadingResponse>> {
  return withTicketCheck("career_startup", (userId, rt) =>
    apiServer.getCareerStartup(request, userId, rt)
  );
}

export async function getCareerBurnoutAction(
  request: CareerBurnoutRequest
): Promise<ActionResult<SajuReadingResponse>> {
  return withTicketCheck("career_burnout", (userId, rt) =>
    apiServer.getCareerBurnout(request, userId, rt)
  );
}

// --- Marriage ---

export async function getMarriageTimingAction(
  request: MarriageTimingRequest
): Promise<ActionResult<MarriageTimingResponse>> {
  return withTicketCheck("marriage_timing", (userId, rt) =>
    apiServer.getMarriageTiming(request, userId, rt)
  );
}

export async function getMarriageLifeForecastAction(
  request: MarriageLifeForecastRequest
): Promise<ActionResult<MarriageTimingResponse>> {
  return withTicketCheck("marriage_life_forecast", (userId, rt) =>
    apiServer.getMarriageLifeForecast(request, userId, rt)
  );
}

export async function getMarriageFinanceAction(
  request: MarriageFinanceRequest
): Promise<ActionResult<MarriageTimingResponse>> {
  return withTicketCheck("marriage_finance", (userId, rt) =>
    apiServer.getMarriageFinance(request, userId, rt)
  );
}

export async function getMarriageAuspiciousDatesAction(
  request: MarriageAuspiciousDatesRequest
): Promise<ActionResult<MarriageTimingResponse>> {
  return withTicketCheck("marriage_auspicious_dates", (userId, rt) =>
    apiServer.getMarriageAuspiciousDates(request, userId, rt)
  );
}
