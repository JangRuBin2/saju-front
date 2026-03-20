import { z } from "zod";
import { generateServiceToken } from "./service-token";
import type {
  BirthInput,
  SajuReadingRequest,
  FortuneRequest,
  CompatibilityRequest,
  PetReadingRequest,
  PetCompatibilityRequest,
  PetYearlyFortuneRequest,
  PetAdoptionTimingRequest,
  CareerTransitionRequest,
  CareerStayOrGoRequest,
  CareerStartupRequest,
  CareerBurnoutRequest,
  MarriageTimingRequest,
  MarriageLifeForecastRequest,
  MarriageFinanceRequest,
  MarriageAuspiciousDatesRequest,
} from "@/types/api";
import {
  SajuCalculateResponseSchema,
  SajuReadingResponseSchema,
  FortuneResponseSchema,
  CompatibilityResponseSchema,
  PetReadingResponseSchema,
  PetCompatibilityResponseSchema,
  MarriageTimingResponseSchema,
} from "@/lib/schemas/api-response";

function getApiServerUrl(): string {
  const url = process.env.API_SERVER_URL;
  if (!url) {
    throw new Error("API_SERVER_URL environment variable is required");
  }
  return url;
}

async function serverRequest<T>(
  endpoint: string,
  body: unknown,
  userId: string,
  readingType: string,
  schema: z.ZodType<T>
): Promise<T> {
  const token = generateServiceToken(userId, readingType);
  const url = `${getApiServerUrl()}${endpoint}`;

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

  const data = await response.json();
  return schema.parse(data);
}

export async function calculateSaju(
  birthInfo: BirthInput,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/saju/calculate",
    { birth: birthInfo },
    userId,
    readingType,
    SajuCalculateResponseSchema
  );
}

export async function getDailyFortune(
  request: FortuneRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/fortune/daily",
    request,
    userId,
    readingType,
    FortuneResponseSchema
  );
}

export async function getMonthlyFortune(
  request: FortuneRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/fortune/monthly",
    request,
    userId,
    readingType,
    FortuneResponseSchema
  );
}

export async function getCompatibility(
  request: CompatibilityRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/compatibility/analyze",
    request,
    userId,
    readingType,
    CompatibilityResponseSchema
  );
}

export async function getSinsal(
  birthInfo: BirthInput,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/saju/sinsal",
    { birth: birthInfo },
    userId,
    readingType,
    SajuReadingResponseSchema
  );
}

export async function streamSajuReading(
  request: SajuReadingRequest,
  userId: string,
  readingType: string
): Promise<Response> {
  const token = generateServiceToken(userId, readingType);
  const url = `${getApiServerUrl()}/saju/reading`;

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
) {
  return serverRequest(
    "/pet/reading",
    request,
    userId,
    readingType,
    PetReadingResponseSchema
  );
}

export async function getPetCompatibility(
  request: PetCompatibilityRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/pet/compatibility",
    request,
    userId,
    readingType,
    PetCompatibilityResponseSchema
  );
}

export async function getPetYearlyFortune(
  request: PetYearlyFortuneRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/pet/fortune/yearly",
    request,
    userId,
    readingType,
    PetReadingResponseSchema
  );
}

export async function getPetAdoptionTiming(
  request: PetAdoptionTimingRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/pet/adoption-timing",
    request,
    userId,
    readingType,
    SajuReadingResponseSchema
  );
}

// --- Career ---

export async function getCareerTransition(
  request: CareerTransitionRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/career/transition",
    request,
    userId,
    readingType,
    SajuReadingResponseSchema
  );
}

export async function getCareerStayOrGo(
  request: CareerStayOrGoRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/career/stay-or-go",
    request,
    userId,
    readingType,
    SajuReadingResponseSchema
  );
}

export async function getCareerStartup(
  request: CareerStartupRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/career/startup",
    request,
    userId,
    readingType,
    SajuReadingResponseSchema
  );
}

export async function getCareerBurnout(
  request: CareerBurnoutRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/career/burnout",
    request,
    userId,
    readingType,
    SajuReadingResponseSchema
  );
}

// --- Marriage ---

export async function getMarriageTiming(
  request: MarriageTimingRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/marriage/timing",
    request,
    userId,
    readingType,
    MarriageTimingResponseSchema
  );
}

export async function getMarriageLifeForecast(
  request: MarriageLifeForecastRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/marriage/life-forecast",
    request,
    userId,
    readingType,
    MarriageTimingResponseSchema
  );
}

export async function getMarriageFinance(
  request: MarriageFinanceRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/marriage/finance",
    request,
    userId,
    readingType,
    MarriageTimingResponseSchema
  );
}

export async function getMarriageAuspiciousDates(
  request: MarriageAuspiciousDatesRequest,
  userId: string,
  readingType: string
) {
  return serverRequest(
    "/marriage/auspicious-dates",
    request,
    userId,
    readingType,
    MarriageTimingResponseSchema
  );
}
