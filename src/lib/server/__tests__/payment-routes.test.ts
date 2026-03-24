import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock dependencies (hoisted) ──
const { mockAuth, mockCreatePaymentOrder, mockConfirmPayment, mockGetUserPayments, mockPrisma } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockCreatePaymentOrder: vi.fn(),
  mockConfirmPayment: vi.fn(),
  mockGetUserPayments: vi.fn(),
  mockPrisma: { payment: { updateMany: vi.fn() } },
}));

vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));
vi.mock("@/lib/server/payment-service", () => ({
  createPaymentOrder: (...args: unknown[]) => mockCreatePaymentOrder(...args),
  confirmPayment: (...args: unknown[]) => mockConfirmPayment(...args),
  getUserPayments: (...args: unknown[]) => mockGetUserPayments(...args),
}));
vi.mock("@/lib/server/prisma", () => ({ prisma: mockPrisma }));

beforeEach(() => {
  vi.clearAllMocks();
});

// ═══════════════════════════════════════
// 1. PUT /api/payments/confirm — 주문 생성
// ═══════════════════════════════════════
describe("PUT /api/payments/confirm (주문 생성)", () => {
  async function callPut(body: Record<string, unknown>, session: unknown = null) {
    mockAuth.mockResolvedValue(session);

    const { PUT } = await import("@/app/api/payments/confirm/route");
    const request = new Request("http://localhost/api/payments/confirm", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return PUT(request as any);
  }

  it("정상: 인증된 사용자가 주문 생성", async () => {
    mockCreatePaymentOrder.mockResolvedValue("ef_user1234_1710000000");

    const res = await callPut(
      { readingTypeId: "rt-1", amount: 3900 },
      { user: { id: "user-123" } }
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.orderId).toBe("ef_user1234_1710000000");
  });

  it("실패: 미인증 사용자 → 401", async () => {
    const res = await callPut({ readingTypeId: "rt-1", amount: 3900 });
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("실패: readingTypeId 누락 → 400", async () => {
    const res = await callPut(
      { amount: 3900 },
      { user: { id: "user-123" } }
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("required");
  });

  it("실패: amount 누락 → 400", async () => {
    const res = await callPut(
      { readingTypeId: "rt-1" },
      { user: { id: "user-123" } }
    );
    const data = await res.json();

    expect(res.status).toBe(400);
  });

  it("★ amount가 0이면 → 400 (무료 결제 방지)", async () => {
    const res = await callPut(
      { readingTypeId: "rt-1", amount: 0 },
      { user: { id: "user-123" } }
    );
    const data = await res.json();

    // amount: 0 은 falsy이므로 현재 코드에서 400을 반환함
    expect(res.status).toBe(400);
  });

  it("★ amount가 음수이면 → 400 (수정됨)", async () => {
    const res = await callPut(
      { readingTypeId: "rt-1", amount: -1000 },
      { user: { id: "user-123" } }
    );

    expect(res.status).toBe(400);
    expect(mockCreatePaymentOrder).not.toHaveBeenCalled();
  });

  it("★ amount가 소수이면 → 400 (정수만 허용)", async () => {
    const res = await callPut(
      { readingTypeId: "rt-1", amount: 39.5 },
      { user: { id: "user-123" } }
    );

    expect(res.status).toBe(400);
  });

  it("★ amount가 문자열이면 → 400", async () => {
    const res = await callPut(
      { readingTypeId: "rt-1", amount: "3900" },
      { user: { id: "user-123" } }
    );

    expect(res.status).toBe(400);
  });
});

// ═══════════════════════════════════════
// 2. GET /api/payments/confirm — 토스 리다이렉트 결제 확인
// ═══════════════════════════════════════
describe("GET /api/payments/confirm (토스 결제 확인 리다이렉트)", () => {
  async function callGet(params: Record<string, string>) {
    const { GET } = await import("@/app/api/payments/confirm/route");
    const url = new URL("http://localhost/api/payments/confirm");
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const request = new Request(url.toString());

    return GET(request as any);
  }

  it("정상: 토스 결제 성공 → success 페이지로 리다이렉트", async () => {
    mockConfirmPayment.mockResolvedValue({ success: true });

    const res = await callGet({
      paymentKey: "pk_test",
      orderId: "ef_user_123",
      amount: "3900",
      locale: "ko",
    });

    expect(res.status).toBe(307);
    expect(res.headers.get("Location")).toContain("/ko/payment/success");
  });

  it("실패: 토스 결제 실패 → fail 페이지로 리다이렉트", async () => {
    mockConfirmPayment.mockResolvedValue({ success: false, error: "카드 거절" });

    const res = await callGet({
      paymentKey: "pk_test",
      orderId: "ef_user_123",
      amount: "3900",
      locale: "ko",
    });

    expect(res.status).toBe(307);
    expect(res.headers.get("Location")).toContain("/ko/payment/fail");
  });

  it("실패: paymentKey 누락 → fail 리다이렉트", async () => {
    const res = await callGet({
      orderId: "ef_user_123",
      amount: "3900",
      locale: "ko",
    });

    expect(res.status).toBe(307);
    expect(res.headers.get("Location")).toContain("/ko/payment/fail");
    expect(mockConfirmPayment).not.toHaveBeenCalled();
  });

  it("locale이 없으면 기본값 'ko' 사용", async () => {
    const res = await callGet({
      orderId: "ef_user_123",
      amount: "3900",
    });

    expect(res.headers.get("Location")).toContain("/ko/payment/fail");
  });

  it("★ amount가 NaN이면 → fail 리다이렉트", async () => {
    const res = await callGet({
      paymentKey: "pk_test",
      orderId: "ef_user_123",
      amount: "invalid",
      locale: "ko",
    });

    // Number("invalid") === NaN, NaN은 falsy이므로 fail로 감
    expect(res.status).toBe(307);
    expect(res.headers.get("Location")).toContain("/ko/payment/fail");
  });
});

// ═══════════════════════════════════════
// 3. GET /api/payments/confirm?list=true — 결제 내역 조회
// ═══════════════════════════════════════
describe("GET /api/payments/confirm?list=true (결제 내역)", () => {
  it("정상: 인증된 사용자의 결제 내역 반환", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockGetUserPayments.mockResolvedValue([{ id: "pay-1" }]);

    const { GET } = await import("@/app/api/payments/confirm/route");
    const request = new Request("http://localhost/api/payments/confirm?list=true");
    const res = await GET(request as any);
    const data = await res.json();

    expect(data.payments).toEqual([{ id: "pay-1" }]);
  });

  it("실패: 미인증 → 401", async () => {
    mockAuth.mockResolvedValue(null);

    const { GET } = await import("@/app/api/payments/confirm/route");
    const request = new Request("http://localhost/api/payments/confirm?list=true");
    const res = await GET(request as any);

    expect(res.status).toBe(401);
  });
});

// ═══════════════════════════════════════
// 4. POST /api/payments/webhook — 토스 웹훅
// ═══════════════════════════════════════
describe("POST /api/payments/webhook (토스 웹훅)", () => {
  async function callWebhook(body: Record<string, unknown>) {
    const { POST } = await import("@/app/api/payments/webhook/route");
    const request = new Request("http://localhost/api/payments/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return POST(request as any);
  }

  it("CANCELED 상태 → DB에 canceled로 업데이트", async () => {
    mockPrisma.payment.updateMany.mockResolvedValue({ count: 1 });

    const res = await callWebhook({
      eventType: "PAYMENT_STATUS_CHANGED",
      data: { orderId: "ef_user_123", status: "CANCELED" },
    });
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(mockPrisma.payment.updateMany).toHaveBeenCalledWith({
      where: { orderId: "ef_user_123" },
      data: { status: "canceled" },
    });
  });

  it("EXPIRED 상태 → DB에 expired로 업데이트", async () => {
    mockPrisma.payment.updateMany.mockResolvedValue({ count: 1 });

    const res = await callWebhook({
      eventType: "PAYMENT_STATUS_CHANGED",
      data: { orderId: "ef_user_456", status: "EXPIRED" },
    });

    expect(mockPrisma.payment.updateMany).toHaveBeenCalledWith({
      where: { orderId: "ef_user_456" },
      data: { status: "expired" },
    });
  });

  it("DONE 상태 (성공) → DB 업데이트 안 함 (confirm에서 처리)", async () => {
    const res = await callWebhook({
      eventType: "PAYMENT_STATUS_CHANGED",
      data: { orderId: "ef_user_789", status: "DONE" },
    });

    expect(mockPrisma.payment.updateMany).not.toHaveBeenCalled();
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("알 수 없는 eventType → 무시하고 success 반환", async () => {
    const res = await callWebhook({
      eventType: "UNKNOWN_EVENT",
      data: {},
    });
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(mockPrisma.payment.updateMany).not.toHaveBeenCalled();
  });

  it("★ TOSS_WEBHOOK_SECRET 미설정 시 서명 없이도 통과 (개발 환경)", async () => {
    // TOSS_WEBHOOK_SECRET이 빈 문자열이면 서명 검증 건너뜀
    const res = await callWebhook({
      eventType: "PAYMENT_STATUS_CHANGED",
      data: { orderId: "ef_test_order", status: "CANCELED" },
    });

    // 프로덕션에서는 반드시 TOSS_WEBHOOK_SECRET 설정 필요
    expect(res.status).toBe(200);
  });
});
