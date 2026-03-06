export class TicketRequiredError extends Error {
  constructor(readingType: string) {
    super(`Ticket required for ${readingType}`);
    this.name = "TicketRequiredError";
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
  | { success: false; error: string; errorType: "ticket_required" | "auth_required" | "server_error" };
