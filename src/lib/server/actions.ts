"use server";

import { auth } from "@/lib/auth";
import { getUserTier } from "./user-tier";
import { checkUsageLimit, recordUsage } from "./usage-limiter";
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

async function getAuthContext(): Promise<{
  userId: string | null;
  sessionId: string | null;
  tier: "free" | "premium";
}> {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const tier = userId ? await getUserTier(userId) : "free";
  const sessionId = userId ? null : "anonymous";
  return { userId, sessionId, tier };
}

async function withUsageCheck<T>(
  action: string,
  fn: (userId: string, tier: "free" | "premium") => Promise<T>
): Promise<ActionResult<T>> {
  const { userId, sessionId, tier } = await getAuthContext();
  const effectiveUserId = userId || sessionId || "anonymous";

  const { allowed } = await checkUsageLimit(userId, sessionId, action, tier);
  if (!allowed) {
    const isPremiumOnly = ["monthly_fortune", "sinsal"].includes(action);
    return {
      success: false,
      error: isPremiumOnly
        ? `Premium subscription required for ${action}`
        : `Daily usage limit reached for ${action}`,
      errorType: isPremiumOnly ? "premium_required" : "usage_limit",
    };
  }

  try {
    const data = await fn(effectiveUserId, tier);
    await recordUsage(userId, sessionId, action);
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
  birth: BirthInput
): Promise<ActionResult<SajuCalculateResponse>> {
  return withUsageCheck("saju_reading", (userId, tier) =>
    apiServer.calculateSaju(birth, userId, tier)
  );
}

export async function getDailyFortuneAction(
  request: FortuneRequest
): Promise<ActionResult<FortuneResponse>> {
  return withUsageCheck("daily_fortune", (userId, tier) =>
    apiServer.getDailyFortune(request, userId, tier)
  );
}

export async function getMonthlyFortuneAction(
  request: FortuneRequest
): Promise<ActionResult<FortuneResponse>> {
  return withUsageCheck("monthly_fortune", (userId, tier) =>
    apiServer.getMonthlyFortune(request, userId, tier)
  );
}

export async function getCompatibilityAction(
  request: CompatibilityRequest
): Promise<ActionResult<CompatibilityResponse>> {
  return withUsageCheck("compatibility", (userId, tier) =>
    apiServer.getCompatibility(request, userId, tier)
  );
}

export async function getSinsalAction(
  birth: BirthInput
): Promise<ActionResult<SajuCalculateResponse>> {
  return withUsageCheck("sinsal", (userId, tier) =>
    apiServer.getSinsal(birth, userId, tier)
  );
}
