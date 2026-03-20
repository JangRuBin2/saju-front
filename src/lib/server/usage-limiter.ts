import { findUnusedPayment, consumePayment } from "./payment-service";

const isDevMode = process.env.DEV_MODE === "true";

export async function checkTicket(
  userId: string,
  readingTypeCode: string
): Promise<{ allowed: boolean; paymentId: string | null }> {
  if (isDevMode) {
    return { allowed: true, paymentId: null };
  }

  const payment = await findUnusedPayment(userId, readingTypeCode);
  if (payment) {
    return { allowed: true, paymentId: payment.id };
  }
  return { allowed: false, paymentId: null };
}

export { consumePayment };
