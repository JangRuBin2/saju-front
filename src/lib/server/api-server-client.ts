import { generateServiceToken } from "./service-token";
import type {
  BirthInput,
  SajuCalculateResponse,
  FortuneRequest,
  FortuneResponse,
  CompatibilityRequest,
  CompatibilityResponse,
  SajuReadingRequest,
} from "@/types/api";

const API_SERVER_URL =
  process.env.API_SERVER_URL || "http://13.124.36.79:8000/api/v1";

async function serverRequest<T>(
  endpoint: string,
  body: unknown,
  userId: string,
  tier: "free" | "premium" = "free"
): Promise<T> {
  const token = generateServiceToken(userId, tier);
  const url = `${API_SERVER_URL}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Service-Token": token,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `API Server Error: ${response.status}`;
    try {
      const errorBody = await response.json();
      message = errorBody.message || errorBody.detail || message;
    } catch {
      // use default message
    }
    throw new Error(message);
  }

  return response.json();
}

export async function calculateSaju(
  birthInfo: BirthInput,
  userId: string,
  tier: "free" | "premium" = "free"
): Promise<SajuCalculateResponse> {
  return serverRequest<SajuCalculateResponse>(
    "/saju/calculate",
    { birth: birthInfo },
    userId,
    tier
  );
}

export async function getDailyFortune(
  request: FortuneRequest,
  userId: string,
  tier: "free" | "premium" = "free"
): Promise<FortuneResponse> {
  return serverRequest<FortuneResponse>(
    "/fortune/daily",
    request,
    userId,
    tier
  );
}

export async function getMonthlyFortune(
  request: FortuneRequest,
  userId: string,
  tier: "free" | "premium" = "free"
): Promise<FortuneResponse> {
  return serverRequest<FortuneResponse>(
    "/fortune/monthly",
    request,
    userId,
    tier
  );
}

export async function getCompatibility(
  request: CompatibilityRequest,
  userId: string,
  tier: "free" | "premium" = "free"
): Promise<CompatibilityResponse> {
  return serverRequest<CompatibilityResponse>(
    "/compatibility/analyze",
    request,
    userId,
    tier
  );
}

export async function getSinsal(
  birthInfo: BirthInput,
  userId: string,
  tier: "free" | "premium" = "free"
): Promise<SajuCalculateResponse> {
  return serverRequest<SajuCalculateResponse>(
    "/saju/sinsal",
    { birth: birthInfo },
    userId,
    tier
  );
}

export async function streamSajuReading(
  request: SajuReadingRequest,
  userId: string,
  tier: "free" | "premium" = "free"
): Promise<Response> {
  const token = generateServiceToken(userId, tier);
  const url = `${API_SERVER_URL}/saju/reading`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Service-Token": token,
    },
    body: JSON.stringify({ ...request, stream: true }),
  });

  if (!response.ok) {
    throw new Error(`API Server Error: ${response.status}`);
  }

  return response;
}
