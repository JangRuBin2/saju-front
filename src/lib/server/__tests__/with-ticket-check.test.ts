import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoisted mocks ──
const { mockAuth, mockCheckTicket, mockConsumePayment, mockCalculateSaju } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockCheckTicket: vi.fn(),
  mockConsumePayment: vi.fn(),
  mockCalculateSaju: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));

vi.mock("../usage-limiter", () => ({
  checkTicket: (...args: unknown[]) => mockCheckTicket(...args),
  consumePayment: (...args: unknown[]) => mockConsumePayment(...args),
}));

vi.mock("../api-server-client", () => ({
  calculateSaju: (...args: unknown[]) => mockCalculateSaju(...args),
  getDailyFortune: vi.fn(),
  getMonthlyFortune: vi.fn(),
  getCompatibility: vi.fn(),
  getSinsal: vi.fn(),
  getPetReading: vi.fn(),
  getPetCompatibility: vi.fn(),
  getPetYearlyFortune: vi.fn(),
  getPetAdoptionTiming: vi.fn(),
  getCareerTransition: vi.fn(),
  getCareerStayOrGo: vi.fn(),
  getCareerStartup: vi.fn(),
  getCareerBurnout: vi.fn(),
  getMarriageTiming: vi.fn(),
  getMarriageLifeForecast: vi.fn(),
  getMarriageFinance: vi.fn(),
  getMarriageAuspiciousDates: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_TEST_MODE", "false");
});

// ═══════════════════════════════════════
// withTicketCheck (via calculateSajuAction)
// ═══════════════════════════════════════
describe("withTicketCheck (Server Action 래퍼)", () => {
  const sampleBirth = {
    year: 1990,
    month: 5,
    day: 15,
    hour: 10,
    minute: 30,
    gender: "M" as const,
    calendarType: "solar" as const,
  };

  it("정상: 인증 + 티켓 있음 → API 호출 → 티켓 소비 → success", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockCheckTicket.mockResolvedValue({ allowed: true, paymentId: "pay-1" });
    mockCalculateSaju.mockResolvedValue({ result: "사주 데이터" });

    const { calculateSajuAction } = await import("../actions");
    const result = await calculateSajuAction(sampleBirth);

    expect(result).toEqual({ success: true, data: { result: "사주 데이터" } });
    expect(mockConsumePayment).toHaveBeenCalledWith("pay-1");
  });

  it("실패: 미인증 → auth_required 에러", async () => {
    mockAuth.mockResolvedValue(null);

    const { calculateSajuAction } = await import("../actions");
    const result = await calculateSajuAction(sampleBirth);

    expect(result).toEqual({
      success: false,
      error: "Login required",
      errorType: "auth_required",
    });
    expect(mockCheckTicket).not.toHaveBeenCalled();
  });

  it("실패: 인증됐지만 티켓 없음 → ticket_required 에러", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockCheckTicket.mockResolvedValue({ allowed: false, paymentId: null });

    const { calculateSajuAction } = await import("../actions");
    const result = await calculateSajuAction(sampleBirth);

    expect(result).toEqual({
      success: false,
      error: "Ticket required for saju_reading",
      errorType: "ticket_required",
    });
    expect(mockCalculateSaju).not.toHaveBeenCalled();
  });

  it("★ 핵심: API 실패 시 티켓이 소비되지 않아야 함", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockCheckTicket.mockResolvedValue({ allowed: true, paymentId: "pay-1" });
    mockCalculateSaju.mockRejectedValue(new Error("API server timeout"));

    const { calculateSajuAction } = await import("../actions");
    const result = await calculateSajuAction(sampleBirth);

    expect(result).toEqual({
      success: false,
      error: "API server timeout",
      errorType: "server_error",
    });
    // API 실패 시 티켓이 소비되면 안 됨
    expect(mockConsumePayment).not.toHaveBeenCalled();
  });

  it("★ 핵심: 무료 티켓(paymentId null)은 consumePayment 호출 안 함", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockCheckTicket.mockResolvedValue({ allowed: true, paymentId: null });
    mockCalculateSaju.mockResolvedValue({ result: "data" });

    const { calculateSajuAction } = await import("../actions");
    const result = await calculateSajuAction(sampleBirth);

    expect(result.success).toBe(true);
    expect(mockConsumePayment).not.toHaveBeenCalled();
  });

  it("TEST_MODE: 인증/티켓 체크 바이패스", async () => {
    vi.stubEnv("NEXT_PUBLIC_TEST_MODE", "true");
    vi.resetModules();
    mockCalculateSaju.mockResolvedValue({ result: "test data" });

    const { calculateSajuAction } = await import("../actions");
    const result = await calculateSajuAction(sampleBirth);

    expect(result.success).toBe(true);
    // 인증, 티켓 체크 건너뜀
    expect(mockAuth).not.toHaveBeenCalled();
    expect(mockCheckTicket).not.toHaveBeenCalled();
  });
});
