import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import crypto from "crypto";

const TOSS_WEBHOOK_SECRET = process.env.TOSS_WEBHOOK_SECRET || "";

function verifyWebhookSignature(body: string, signature: string | null): boolean {
  if (!TOSS_WEBHOOK_SECRET) return false;
  if (!signature) return false;

  const expected = crypto
    .createHmac("sha256", TOSS_WEBHOOK_SECRET)
    .update(body)
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-tosspayments-signature");

  if (TOSS_WEBHOOK_SECRET && !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const { eventType, data } = body;

  if (eventType === "PAYMENT_STATUS_CHANGED") {
    const { orderId, status } = data;

    if (status === "CANCELED" || status === "EXPIRED") {
      await prisma.payment.updateMany({
        where: { orderId },
        data: { status: status.toLowerCase() },
      });
    }
  }

  return NextResponse.json({ success: true });
}
