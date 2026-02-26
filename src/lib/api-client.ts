import type {
  BirthInput,
  SajuCalculateResponse,
  FortuneRequest,
  FortuneResponse,
  CompatibilityRequest,
  CompatibilityResponse,
  ApiError,
} from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/backend-api";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error: ApiError = {
        error: "HttpError",
        message: `HTTP ${response.status}: ${response.statusText}`,
        status_code: response.status,
      };
      try {
        const body = await response.json();
        error.message = body.message || body.detail || error.message;
        error.error = body.error || error.error;
      } catch {
        // use default error
      }
      throw error;
    }

    return response.json();
  }

  async calculateSaju(birthInfo: BirthInput): Promise<SajuCalculateResponse> {
    return this.request<SajuCalculateResponse>("/saju/calculate", {
      method: "POST",
      body: JSON.stringify({ birth: birthInfo }),
    });
  }

  async getDailyFortune(request: FortuneRequest): Promise<FortuneResponse> {
    return this.request<FortuneResponse>("/fortune/daily", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getCompatibility(
    request: CompatibilityRequest
  ): Promise<CompatibilityResponse> {
    return this.request<CompatibilityResponse>("/compatibility/analyze", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  getSajuReadingUrl(): string {
    return `${this.baseUrl}/saju/reading`;
  }
}

export const apiClient = new ApiClient(API_BASE);
