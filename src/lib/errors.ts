export class UsageLimitError extends Error {
  constructor(action: string) {
    super(`Daily usage limit reached for ${action}`);
    this.name = "UsageLimitError";
  }
}

export class PremiumRequiredError extends Error {
  constructor(action: string) {
    super(`Premium subscription required for ${action}`);
    this.name = "PremiumRequiredError";
  }
}

export class AuthRequiredError extends Error {
  constructor() {
    super("Authentication required");
    this.name = "AuthRequiredError";
  }
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; errorType: "usage_limit" | "premium_required" | "auth_required" | "server_error" };
