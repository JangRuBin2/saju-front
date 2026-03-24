import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { confirmPayment, createPaymentOrder, getUserPayments } from "@/lib/server/payment-service";

// PUT: Create a payment order for a reading type
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { readingTypeId, amount } = await request.json();
  if (!readingTypeId || typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json({ error: "readingTypeId and a positive integer amount are required" }, { status: 400 });
  }

  const orderId = await createPaymentOrder(session.user.id, readingTypeId, amount);
  return NextResponse.json({ orderId });
}

// GET: Handle Toss redirect after payment, or list payments
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // List payments for current user
  if (searchParams.get("list") === "true") {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payments = await getUserPayments(session.user.id);
    return NextResponse.json({ payments });
  }

  // Handle Toss payment confirmation redirect
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = Number(searchParams.get("amount"));
  const locale = searchParams.get("locale") || "ko";

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.redirect(new URL(`/${locale}/payment/fail`, request.url));
  }

  const result = await confirmPayment(paymentKey, orderId, amount);

  if (result.success) {
    return NextResponse.redirect(new URL(`/${locale}/payment/success`, request.url));
  }

  return NextResponse.redirect(new URL(`/${locale}/payment/fail`, request.url));
}
