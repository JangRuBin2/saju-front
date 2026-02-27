import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getUserTier } from "@/lib/server/user-tier";
import { checkUsageLimit, recordUsage } from "@/lib/server/usage-limiter";
import { streamSajuReading } from "@/lib/server/api-server-client";

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const tier = userId ? await getUserTier(userId) : "free";
  const sessionId = userId ? null : "anonymous";
  const effectiveUserId = userId || "anonymous";

  const { allowed } = await checkUsageLimit(
    userId,
    sessionId,
    "saju_reading",
    tier
  );
  if (!allowed) {
    return new Response(
      JSON.stringify({
        error: "UsageLimitError",
        message: "Daily usage limit reached for saju_reading",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await request.json();

  try {
    const apiResponse = await streamSajuReading(body, effectiveUserId, tier);

    if (!apiResponse.body) {
      throw new Error("No response body from API server");
    }

    // Record usage on successful stream start
    await recordUsage(userId, sessionId, "saju_reading");

    // Pass through the SSE stream
    return new Response(apiResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "ServerError",
        message:
          error instanceof Error ? error.message : "Failed to start reading",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
