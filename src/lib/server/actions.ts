"use server";

import { auth } from "@/lib/auth";
import { checkTicket, consumePayment } from "./usage-limiter";
import * as apiServer from "./api-server-client";
import type {
  BirthInput,
  FortuneRequest,
  CompatibilityRequest,
} from "@/types/api";
import type { ActionResult } from "@/lib/errors";
import type {
  SajuCalculateResponse,
  FortuneResponse,
  CompatibilityResponse,
} from "@/types/api";

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
): Promise<ActionResult<SajuCalculateResponse>> {
  return withTicketCheck("sinsal", (userId, rt) =>
    apiServer.getSinsal(birth, userId, rt)
  );
}
