import { prisma } from "./prisma";

const FREE_LIMITS: Record<string, number> = {
  saju_reading: 1,
  daily_fortune: 1,
  compatibility: 1,
};

const PREMIUM_ONLY_ACTIONS = ["monthly_fortune", "sinsal"];

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function checkUsageLimit(
  userId: string | null,
  sessionId: string | null,
  action: string,
  tier: "free" | "premium"
): Promise<{ allowed: boolean; remaining: number }> {
  if (tier === "premium") {
    return { allowed: true, remaining: -1 };
  }

  if (PREMIUM_ONLY_ACTIONS.includes(action)) {
    return { allowed: false, remaining: 0 };
  }

  const limit = FREE_LIMITS[action];
  if (limit === undefined) {
    return { allowed: true, remaining: -1 };
  }

  const today = getTodayString();

  const count = await prisma.usageLog.count({
    where: {
      ...(userId ? { userId } : { sessionId }),
      action,
      date: today,
    },
  });

  const remaining = Math.max(0, limit - count);
  return { allowed: count < limit, remaining };
}

export async function recordUsage(
  userId: string | null,
  sessionId: string | null,
  action: string
): Promise<void> {
  await prisma.usageLog.create({
    data: {
      userId,
      sessionId,
      action,
      date: getTodayString(),
    },
  });
}
