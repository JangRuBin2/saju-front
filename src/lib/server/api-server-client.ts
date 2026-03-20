import { generateServiceToken } from "./service-token";
import type {
  BirthInput,
  SajuCalculateResponse,
  SajuReadingResponse,
  FortuneRequest,
  FortuneResponse,
  CompatibilityRequest,
  CompatibilityResponse,
  SajuReadingRequest,
  PetReadingRequest,
  PetReadingResponse,
  PetCompatibilityRequest,
  PetCompatibilityResponse,
  PetYearlyFortuneRequest,
  PetAdoptionTimingRequest,
  CareerTransitionRequest,
  CareerStayOrGoRequest,
  CareerStartupRequest,
  CareerBurnoutRequest,
  MarriageTimingRequest,
  MarriageTimingResponse,
  MarriageLifeForecastRequest,
  MarriageFinanceRequest,
  MarriageAuspiciousDatesRequest,
} from "@/types/api";

const API_SERVER_URL =
  process.env.API_SERVER_URL || "http://13.124.36.79:8000/api/v1";

async function serverRequest<T>(
  endpoint: string,
  body: unknown,
  userId: string,
  readingType: string
): Promise<T> {
  const token = generateServiceToken(userId, readingType);
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
  readingType: string
): Promise<SajuCalculateResponse> {
  return serverRequest<SajuCalculateResponse>(
    "/saju/calculate",
    { birth: birthInfo },
    userId,
    readingType
  );
}

export async function getDailyFortune(
  request: FortuneRequest,
  userId: string,
  readingType: string
): Promise<FortuneResponse> {
  return serverRequest<FortuneResponse>(
    "/fortune/daily",
    request,
    userId,
    readingType
  );
}

export async function getMonthlyFortune(
  request: FortuneRequest,
  userId: string,
  readingType: string
): Promise<FortuneResponse> {
  return serverRequest<FortuneResponse>(
    "/fortune/monthly",
    request,
    userId,
    readingType
  );
}

export async function getCompatibility(
  request: CompatibilityRequest,
  userId: string,
  readingType: string
): Promise<CompatibilityResponse> {
  return serverRequest<CompatibilityResponse>(
    "/compatibility/analyze",
    request,
    userId,
    readingType
  );
}

export async function getSinsal(
  birthInfo: BirthInput,
  userId: string,
  readingType: string
): Promise<SajuReadingResponse> {
  return serverRequest<SajuReadingResponse>(
    "/saju/sinsal",
    { birth: birthInfo },
    userId,
    readingType
  );
}

export async function streamSajuReading(
  request: SajuReadingRequest,
  userId: string,
  readingType: string
): Promise<Response> {
  const token = generateServiceToken(userId, readingType);
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

// --- Pet ---

export async function getPetReading(
  request: PetReadingRequest,
  userId: string,
  readingType: string
): Promise<PetReadingResponse> {
  return serverRequest<PetReadingResponse>(
    "/pet/reading",
    request,
    userId,
    readingType
  );
}

export async function getPetCompatibility(
  request: PetCompatibilityRequest,
  userId: string,
  readingType: string
): Promise<PetCompatibilityResponse> {
  return serverRequest<PetCompatibilityResponse>(
    "/pet/compatibility",
    request,
    userId,
    readingType
  );
}

export async function getPetYearlyFortune(
  request: PetYearlyFortuneRequest,
  userId: string,
  readingType: string
): Promise<PetReadingResponse> {
  return serverRequest<PetReadingResponse>(
    "/pet/fortune/yearly",
    request,
    userId,
    readingType
  );
}

export async function getPetAdoptionTiming(
  request: PetAdoptionTimingRequest,
  userId: string,
  readingType: string
): Promise<SajuReadingResponse> {
  return serverRequest<SajuReadingResponse>(
    "/pet/adoption-timing",
    request,
    userId,
    readingType
  );
}

// --- Career ---

export async function getCareerTransition(
  request: CareerTransitionRequest,
  userId: string,
  readingType: string
): Promise<SajuReadingResponse> {
  return serverRequest<SajuReadingResponse>(
    "/career/transition",
    request,
    userId,
    readingType
  );
}

export async function getCareerStayOrGo(
  request: CareerStayOrGoRequest,
  userId: string,
  readingType: string
): Promise<SajuReadingResponse> {
  return serverRequest<SajuReadingResponse>(
    "/career/stay-or-go",
    request,
    userId,
    readingType
  );
}

export async function getCareerStartup(
  request: CareerStartupRequest,
  userId: string,
  readingType: string
): Promise<SajuReadingResponse> {
  return serverRequest<SajuReadingResponse>(
    "/career/startup",
    request,
    userId,
    readingType
  );
}

export async function getCareerBurnout(
  request: CareerBurnoutRequest,
  userId: string,
  readingType: string
): Promise<SajuReadingResponse> {
  return serverRequest<SajuReadingResponse>(
    "/career/burnout",
    request,
    userId,
    readingType
  );
}

// --- Marriage ---

export async function getMarriageTiming(
  request: MarriageTimingRequest,
  userId: string,
  readingType: string
): Promise<MarriageTimingResponse> {
  return serverRequest<MarriageTimingResponse>(
    "/marriage/timing",
    request,
    userId,
    readingType
  );
}

export async function getMarriageLifeForecast(
  request: MarriageLifeForecastRequest,
  userId: string,
  readingType: string
): Promise<MarriageTimingResponse> {
  return serverRequest<MarriageTimingResponse>(
    "/marriage/life-forecast",
    request,
    userId,
    readingType
  );
}

export async function getMarriageFinance(
  request: MarriageFinanceRequest,
  userId: string,
  readingType: string
): Promise<MarriageTimingResponse> {
  return serverRequest<MarriageTimingResponse>(
    "/marriage/finance",
    request,
    userId,
    readingType
  );
}

export async function getMarriageAuspiciousDates(
  request: MarriageAuspiciousDatesRequest,
  userId: string,
  readingType: string
): Promise<MarriageTimingResponse> {
  return serverRequest<MarriageTimingResponse>(
    "/marriage/auspicious-dates",
    request,
    userId,
    readingType
  );
}
