import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Prisma (vi.hoisted ensures availability before vi.mock hoisting) ──
const { mockPrisma, mockFetch } = vi.hoisted(() => ({
  mockPrisma: {
    payment: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
  mockFetch: vi.fn(),
}));

vi.mock("../prisma", () => ({ prisma: mockPrisma }));
vi.stubGlobal("fetch", mockFetch);
vi.stubEnv("TOSS_SECRET_KEY", "test_sk_secret_key_123");

import {
  createPaymentOrder,
  confirmPayment,
  findUnusedPayment,
  consumePayment,
  getUserPayments,
  getUserUnusedTickets,
} from "../payment-service";

beforeEach(() => {
  vi.clearAllMocks();
});

// ═══════════════════════════════════════
// 1. 주문 생성 (createPaymentOrder)
// ═══════════════════════════════════════
describe("createPaymentOrder", () => {
  it("정상: orderId를 생성하고 DB에 pending 상태로 저장", async () => {
    mockPrisma.payment.create.mockResolvedValue({ orderId: "ef_abc12345_1234567890" });

    const orderId = await createPaymentOrder("user-abc12345", "reading-type-1", 3900);

    expect(orderId).toMatch(/^ef_user-abc_\d+$/);
    expect(mockPrisma.payment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-abc12345",
        amount: 3900,
        readingTypeId: "reading-type-1",
        status: "pending",
      }),
    });
  });

  it("orderId 형식이 고유하도록 timestamp 포함", async () => {
    mockPrisma.payment.create.mockResolvedValue({});

    const orderId1 = await createPaymentOrder("user-abc12345", "rt-1", 1000);
    // 아주 미세한 시간 차이로도 다른 orderId 생성
    const orderId2 = await createPaymentOrder("user-abc12345", "rt-1", 1000);

    // timestamp 부분이 다르므로 둘은 같지 않을 수 있음 (빠르면 같을 수도)
    expect(orderId1).toMatch(/^ef_user-abc_\d+$/);
    expect(orderId2).toMatch(/^ef_user-abc_\d+$/);
  });
});

// ═══════════════════════════════════════
// 2. 결제 확인 (confirmPayment)
// ═══════════════════════════════════════
describe("confirmPayment", () => {
  const validTossResponse = {
    paymentKey: "pk_test_123",
    orderId: "ef_user1234_1710000000",
    status: "DONE",
    totalAmount: 3900,
    approvedAt: "2026-03-24T10:00:00+09:00",
  };

  it("정상: 토스 승인 성공 → DB paid 업데이트 → success 반환", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(validTossResponse),
    });
    mockPrisma.payment.findUnique.mockResolvedValue({
      orderId: "ef_user1234_1710000000",
      amount: 3900,
    });
    mockPrisma.payment.update.mockResolvedValue({});

    const result = await confirmPayment("pk_test_123", "ef_user1234_1710000000", 3900);

    expect(result).toEqual({ success: true });
    expect(mockPrisma.payment.update).toHaveBeenCalledWith({
      where: { orderId: "ef_user1234_1710000000" },
      data: { paymentKey: "pk_test_123", status: "paid" },
    });
  });

  it("토스 API에 올바른 URL과 Basic Auth 형식으로 요청", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(validTossResponse),
    });
    mockPrisma.payment.findUnique.mockResolvedValue({ orderId: "ord-1", amount: 1000 });
    mockPrisma.payment.update.mockResolvedValue({});

    await confirmPayment("pk_1", "ord-1", 1000);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("https://api.tosspayments.com/v1/payments/confirm");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");
    // Authorization은 Basic base64 형식이어야 함
    expect(options.headers.Authorization).toMatch(/^Basic /);
    // 요청 body에 paymentKey, orderId, amount 포함
    const body = JSON.parse(options.body);
    expect(body).toEqual({ paymentKey: "pk_1", orderId: "ord-1", amount: 1000 });
  });

  it("실패: 토스 API 거절 (카드 한도 초과 등)", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "카드 한도 초과" }),
    });

    const result = await confirmPayment("pk_fail", "ord-fail", 3900);

    expect(result).toEqual({ success: false, error: "카드 한도 초과" });
    // DB는 업데이트되지 않아야 함
    expect(mockPrisma.payment.update).not.toHaveBeenCalled();
  });

  it("실패: 토스 API 거절 시 메시지가 없으면 기본 메시지", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    const result = await confirmPayment("pk_fail", "ord-fail", 1000);

    expect(result).toEqual({ success: false, error: "Payment confirmation failed" });
  });

  it("실패: DB에 주문 레코드가 없음 → 토스 결제 자동 취소", async () => {
    // 첫 번째 fetch: 토스 confirm 성공
    // 두 번째 fetch: 토스 cancel 호출
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(validTossResponse),
      })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    mockPrisma.payment.findUnique.mockResolvedValue(null);

    const result = await confirmPayment("pk_test", "ef_fake_order", 3900);

    expect(result).toEqual({ success: false, error: "Payment record not found" });
    expect(mockPrisma.payment.update).not.toHaveBeenCalled();
    // 토스 결제 취소 API 호출됨
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const cancelCall = mockFetch.mock.calls[1];
    expect(cancelCall[0]).toContain("/pk_test/cancel");
  });

  it("★ 핵심: 금액 불일치 → 토스 결제 자동 취소", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...validTossResponse, totalAmount: 100 }),
      })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    mockPrisma.payment.findUnique.mockResolvedValue({
      orderId: "ef_user1234_1710000000",
      amount: 3900,
    });

    const result = await confirmPayment("pk_test", "ef_user1234_1710000000", 100);

    expect(result).toEqual({ success: false, error: "Amount mismatch" });
    expect(mockPrisma.payment.update).not.toHaveBeenCalled();
    // 토스 결제 취소 API 호출됨
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const cancelCall = mockFetch.mock.calls[1];
    expect(cancelCall[0]).toContain("/pk_test/cancel");
    const cancelBody = JSON.parse(cancelCall[1].body);
    expect(cancelBody.cancelReason).toBe("Amount mismatch");
  });
});

// ═══════════════════════════════════════
// 3. 미사용 결제 조회 (findUnusedPayment)
// ═══════════════════════════════════════
describe("findUnusedPayment", () => {
  it("정상: paid 상태 + usedAt null 인 결제를 찾음", async () => {
    const mockPayment = { id: "pay-1", status: "paid", usedAt: null };
    mockPrisma.payment.findFirst.mockResolvedValue(mockPayment);

    const result = await findUnusedPayment("user-1", "saju_reading");

    expect(result).toEqual(mockPayment);
    expect(mockPrisma.payment.findFirst).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
        status: "paid",
        usedAt: null,
        readingType: { code: "saju_reading" },
      },
      include: { readingType: true },
      orderBy: { createdAt: "asc" },
    });
  });

  it("미사용 결제가 없으면 null 반환", async () => {
    mockPrisma.payment.findFirst.mockResolvedValue(null);

    const result = await findUnusedPayment("user-1", "saju_reading");

    expect(result).toBeNull();
  });

  it("가장 오래된 결제부터 사용 (FIFO)", async () => {
    await findUnusedPayment("user-1", "saju_reading");

    expect(mockPrisma.payment.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "asc" } })
    );
  });
});

// ═══════════════════════════════════════
// 4. 결제 소비 (consumePayment)
// ═══════════════════════════════════════
describe("consumePayment", () => {
  it("정상: status를 used로, usedAt에 현재 시간 기록", async () => {
    mockPrisma.payment.update.mockResolvedValue({});

    await consumePayment("pay-123");

    expect(mockPrisma.payment.update).toHaveBeenCalledWith({
      where: { id: "pay-123" },
      data: {
        status: "used",
        usedAt: expect.any(Date),
      },
    });
  });
});

// ═══════════════════════════════════════
// 5. 사용자 결제 내역 조회
// ═══════════════════════════════════════
describe("getUserPayments", () => {
  it("해당 유저의 모든 결제를 최신순으로 반환", async () => {
    const mockPayments = [
      { id: "pay-2", createdAt: new Date("2026-03-24") },
      { id: "pay-1", createdAt: new Date("2026-03-23") },
    ];
    mockPrisma.payment.findMany.mockResolvedValue(mockPayments);

    const result = await getUserPayments("user-1");

    expect(result).toEqual(mockPayments);
    expect(mockPrisma.payment.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      include: { readingType: true },
      orderBy: { createdAt: "desc" },
    });
  });
});

// ═══════════════════════════════════════
// 6. 미사용 티켓 조회
// ═══════════════════════════════════════
describe("getUserUnusedTickets", () => {
  it("paid + usedAt null 인 결제만 반환", async () => {
    mockPrisma.payment.findMany.mockResolvedValue([]);

    await getUserUnusedTickets("user-1");

    expect(mockPrisma.payment.findMany).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
        status: "paid",
        usedAt: null,
      },
      include: { readingType: true },
      orderBy: { createdAt: "desc" },
    });
  });
});
