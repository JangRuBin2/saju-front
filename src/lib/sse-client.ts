import type { SajuReadingRequest, SajuCalculateResponse } from "@/types/api";

export interface SSECallbacks {
  onCalculation: (data: SajuCalculateResponse) => void;
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export function streamSajuReading(
  request: SajuReadingRequest,
  callbacks: SSECallbacks
): AbortController {
  const controller = new AbortController();
  const url = "/api/saju/reading";

  const body: SajuReadingRequest = {
    ...request,
    stream: true,
  };

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No readable stream available");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let currentEvent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();

          if (trimmed.startsWith("event: ")) {
            currentEvent = trimmed.slice(7).trim();
            continue;
          }

          if (trimmed.startsWith("data: ") || trimmed === "data:") {
            const data = trimmed.startsWith("data: ")
              ? trimmed.slice(6)
              : "";

            if (currentEvent === "calculation") {
              try {
                const parsed = JSON.parse(data);
                callbacks.onCalculation(parsed);
              } catch {
                // skip unparseable calculation
              }
              currentEvent = "";
              continue;
            }

            if (currentEvent === "done" || data === "[DONE]") {
              callbacks.onComplete();
              return;
            }

            if (currentEvent === "interpretation" || !currentEvent) {
              if (data.length > 0) {
                callbacks.onChunk(data);
              }
              continue;
            }

            currentEvent = "";
          }

          if (trimmed === "") {
            currentEvent = "";
          }
        }
      }

      callbacks.onComplete();
    })
    .catch((error) => {
      if (error.name !== "AbortError") {
        callbacks.onError(error);
      }
    });

  return controller;
}
