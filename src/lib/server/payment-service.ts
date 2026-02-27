import { prisma } from "./prisma";

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || "";
const TOSS_API_URL = "https://api.tosspayments.com/v1/payments/confirm";

interface TossConfirmResponse {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  approvedAt: string;
}

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  // Verify payment with Toss
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

  // Find the pending payment record
  const payment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (!payment) {
    return { success: false, error: "Payment record not found" };
  }

  if (payment.amount !== amount) {
    return { success: false, error: "Amount mismatch" };
  }

  // Update payment record
  const now = new Date();
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + 1);

  await prisma.payment.update({
    where: { orderId },
    data: {
      paymentKey: data.paymentKey,
      status: "paid",
      startDate: now,
      endDate,
    },
  });

  return { success: true };
}

export async function createPaymentOrder(
  userId: string,
  plan: string,
  amount: number
): Promise<string> {
  const orderId = `saju_${userId}_${Date.now()}`;

  await prisma.payment.create({
    data: {
      userId,
      orderId,
      amount,
      plan,
      status: "pending",
    },
  });

  return orderId;
}
