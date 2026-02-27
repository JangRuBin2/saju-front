import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
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
