import { findUnusedPayment, consumePayment } from "./payment-service";

export async function checkTicket(
  userId: string,
  readingTypeCode: string
): Promise<{ allowed: boolean; paymentId: string | null }> {
  const payment = await findUnusedPayment(userId, readingTypeCode);
  if (payment) {
    return { allowed: true, paymentId: payment.id };
  }
  return { allowed: false, paymentId: null };
}

export { consumePayment };
