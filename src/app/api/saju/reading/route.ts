import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { checkTicket, consumePayment } from "@/lib/server/usage-limiter";
import { streamSajuReading } from "@/lib/server/api-server-client";

export async function POST(request: NextRequest) {
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";
  const isDevMode = process.env.DEV_MODE === "true";

  let effectiveUserId = "anonymous";
  let readingType = "saju_reading";
  let paymentId: string | null = null;

  const body = await request.json();
  readingType = body.reading_type || "saju_reading";

  if (isTestMode) {
    effectiveUserId = "test-user";
  } else {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", message: "Login required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    effectiveUserId = userId;

    if (!isDevMode) {
      const ticket = await checkTicket(userId, readingType);
      if (!ticket.allowed) {
        return new Response(
          JSON.stringify({
            error: "TicketRequired",
            message: `Ticket required for ${readingType}`,
            readingType,
          }),
          { status: 402, headers: { "Content-Type": "application/json" } }
        );
      }
      paymentId = ticket.paymentId;
    }
  }

  try {
    const apiResponse = await streamSajuReading(body, effectiveUserId, readingType);

    if (!apiResponse.body) {
      throw new Error("No response body from API server");
    }

    // Consume ticket on successful stream start (skip in test mode)
    if (!isTestMode && paymentId) {
      await consumePayment(paymentId);
    }

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
