import { createHmac, randomBytes } from "crypto";

interface ServiceTokenPayload {
  user_id: string;
  reading_type: string;
  timestamp: number;
  nonce: string;
}

function getSecretKey(): string {
  const key = process.env.API_SECRET_KEY;
  if (!key) {
    throw new Error("API_SECRET_KEY environment variable is required");
  }
  return key;
}

function sign(payload: ServiceTokenPayload): string {
  const message = JSON.stringify(payload);
  const hmac = createHmac("sha256", getSecretKey());
  hmac.update(message);
  return hmac.digest("hex");
}

export function generateServiceToken(
  userId: string,
  readingType: string
): string {
  const payload: ServiceTokenPayload = {
    user_id: userId,
    reading_type: readingType,
    timestamp: Math.floor(Date.now() / 1000),
    nonce: randomBytes(16).toString("hex"),
  };

  const signature = sign(payload);
  const token = Buffer.from(
    JSON.stringify({ ...payload, signature })
  ).toString("base64");

  return token;
}

export function verifyServiceToken(
  token: string
): ServiceTokenPayload | null {
  try {
    const decoded = JSON.parse(
      Buffer.from(token, "base64").toString("utf-8")
    );
    const { signature, ...payload } = decoded;
    const expectedSignature = sign(payload as ServiceTokenPayload);

    if (signature !== expectedSignature) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (now - payload.timestamp > 300) {
      return null;
    }

    return payload as ServiceTokenPayload;
  } catch {
    return null;
  }
}
