import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock payment-service (hoisted) ──
const { mockFindUnusedPayment, mockConsumePayment } = vi.hoisted(() => ({
  mockFindUnusedPayment: vi.fn(),
  mockConsumePayment: vi.fn(),
}));

vi.mock("../payment-service", () => ({
  findUnusedPayment: mockFindUnusedPayment,
  consumePayment: mockConsumePayment,
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function importCheckTicket() {
  const mod = await import("../usage-limiter");
  return mod.checkTicket;
}

// ═══════════════════════════════════════
// 1. checkTicket - 티켓 검증
// ═══════════════════════════════════════
describe("checkTicket", () => {
  it("정상: 미사용 결제가 있으면 allowed + paymentId 반환", async () => {
    mockFindUnusedPayment.mockResolvedValue({ id: "pay-123" });
    vi.stubEnv("DEV_MODE", "false");
    const checkTicket = await importCheckTicket();

    const result = await checkTicket("user-1", "saju_reading");

    expect(result).toEqual({ allowed: true, paymentId: "pay-123" });
    expect(mockFindUnusedPayment).toHaveBeenCalledWith("user-1", "saju_reading");
  });

  it("실패: 미사용 결제가 없으면 not allowed", async () => {
    mockFindUnusedPayment.mockResolvedValue(null);
    vi.stubEnv("DEV_MODE", "false");
    const checkTicket = await importCheckTicket();

    const result = await checkTicket("user-1", "saju_reading");

    expect(result).toEqual({ allowed: false, paymentId: null });
  });

  it("DEV_MODE: 티켓 검사 바이패스 → 항상 allowed", async () => {
    vi.stubEnv("DEV_MODE", "true");
    const checkTicket = await importCheckTicket();

    const result = await checkTicket("user-1", "saju_reading");

    expect(result).toEqual({ allowed: true, paymentId: null });
    expect(mockFindUnusedPayment).not.toHaveBeenCalled();
  });

  it("다른 리딩 타입의 티켓으로는 사용 불가 (readingTypeCode 분리)", async () => {
    mockFindUnusedPayment.mockImplementation((_userId: string, code: string) => {
      if (code === "pet_reading") return { id: "pay-pet" };
      return null;
    });
    vi.stubEnv("DEV_MODE", "false");
    const checkTicket = await importCheckTicket();

    const sajuResult = await checkTicket("user-1", "saju_reading");
    const petResult = await checkTicket("user-1", "pet_reading");

    expect(sajuResult).toEqual({ allowed: false, paymentId: null });
    expect(petResult).toEqual({ allowed: true, paymentId: "pay-pet" });
  });
});
