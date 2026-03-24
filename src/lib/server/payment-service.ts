import { prisma } from "./prisma";

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || "";
const TOSS_API_URL = "https://api.tosspayments.com/v1/payments/confirm";
const TOSS_CANCEL_URL = "https://api.tosspayments.com/v1/payments";

interface TossConfirmResponse {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  approvedAt: string;
}

export async function createPaymentOrder(
  userId: string,
  readingTypeId: string,
  amount: number
): Promise<string> {
  const orderId = `ef_${userId.slice(0, 8)}_${Date.now()}`;

  await prisma.payment.create({
    data: {
      userId,
      orderId,
      amount,
      readingTypeId,
      status: "pending",
    },
  });

  return orderId;
}

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(TOSS_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(TOSS_SECRET_KEY + ":").toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || "Payment confirmation failed" };
  }

  const data: TossConfirmResponse = await response.json();

  const payment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (!payment) {
    await cancelTossPayment(paymentKey, "Payment record not found");
    return { success: false, error: "Payment record not found" };
  }

  if (payment.amount !== amount) {
    await cancelTossPayment(paymentKey, "Amount mismatch");
    return { success: false, error: "Amount mismatch" };
  }

  await prisma.payment.update({
    where: { orderId },
    data: {
      paymentKey: data.paymentKey,
      status: "paid",
    },
  });

  return { success: true };
}

async function cancelTossPayment(paymentKey: string, reason: string): Promise<void> {
  try {
    await fetch(`${TOSS_CANCEL_URL}/${paymentKey}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(TOSS_SECRET_KEY + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancelReason: reason }),
    });
  } catch {
    // 취소 실패는 로깅만 — 이후 수동 처리 필요
    console.error(`[CRITICAL] Failed to cancel Toss payment ${paymentKey}: ${reason}`);
  }
}

export async function findUnusedPayment(
  userId: string,
  readingTypeCode: string
) {
  return prisma.payment.findFirst({
    where: {
      userId,
      status: "paid",
      usedAt: null,
      readingType: { code: readingTypeCode },
    },
    include: { readingType: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function consumePayment(paymentId: string): Promise<void> {
  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "used",
      usedAt: new Date(),
    },
  });
}

export async function getUserPayments(userId: string) {
  return prisma.payment.findMany({
    where: { userId },
    include: { readingType: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserUnusedTickets(userId: string) {
  return prisma.payment.findMany({
    where: {
      userId,
      status: "paid",
      usedAt: null,
    },
    include: { readingType: true },
    orderBy: { createdAt: "desc" },
  });
}
