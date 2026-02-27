import { createHmac, randomBytes } from "crypto";

interface ServiceTokenPayload {
  user_id: string;
  tier: "free" | "premium";
  timestamp: number;
  nonce: string;
}

const SECRET_KEY = process.env.API_SECRET_KEY || "";

function sign(payload: ServiceTokenPayload): string {
  const message = JSON.stringify(payload);
  const hmac = createHmac("sha256", SECRET_KEY);
  hmac.update(message);
  return hmac.digest("hex");
}

export function generateServiceToken(
  userId: string,
  tier: "free" | "premium" = "free"
): string {
  const payload: ServiceTokenPayload = {
    user_id: userId,
    tier,
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
