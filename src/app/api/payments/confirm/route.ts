import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { confirmPayment, createPaymentOrder } from "@/lib/server/payment-service";

// PUT: Create a payment order
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan, amount } = await request.json();
  const orderId = await createPaymentOrder(session.user.id, plan, amount);

  return NextResponse.json({ orderId });
}

// GET: Handle Toss redirect after payment
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = Number(searchParams.get("amount"));

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.redirect(new URL("/ko/payment/fail", request.url));
  }

  const result = await confirmPayment(paymentKey, orderId, amount);

  if (result.success) {
    return NextResponse.redirect(new URL("/ko/payment/success", request.url));
  }

  return NextResponse.redirect(new URL("/ko/payment/fail", request.url));
}
