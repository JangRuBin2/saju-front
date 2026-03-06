"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GoldCard } from "./GoldCard";
import { GoldButton } from "./GoldButton";
import { Lock, Ticket } from "lucide-react";

const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

interface PaymentGateProps {
  errorType: "ticket_required" | "auth_required";
  readingType?: string;
  message?: string;
}

export function PaymentGate({ errorType, readingType, message }: PaymentGateProps) {
  const t = useTranslations("Usage");

  if (isTestMode) return null;

  if (errorType === "auth_required") {
    return (
      <GoldCard className="text-center py-8">
        <Lock size={32} className="mx-auto text-gold-500 mb-3" strokeWidth={1.5} />
        <p className="text-sm font-medium text-gold-300 mb-1">
          {t("loginRequired")}
        </p>
        <p className="text-xs text-gold-600 mb-4">{message}</p>
        <Link href="/login">
          <GoldButton className="mx-auto">{t("loginButton")}</GoldButton>
        </Link>
      </GoldCard>
    );
  }

  return (
    <GoldCard className="text-center py-8">
      <Ticket size={32} className="mx-auto text-gold-400 mb-3" strokeWidth={1.5} />
      <p className="text-sm font-medium text-gold-300 mb-1">
        {t("ticketRequired")}
      </p>
      <p className="text-xs text-gold-600 mb-4">{message}</p>
      <Link href={readingType ? `/payment?type=${readingType}` : "/payment"}>
        <GoldButton className="mx-auto">{t("purchaseTicket")}</GoldButton>
      </Link>
    </GoldCard>
  );
}

// Keep backward compatibility alias
export { PaymentGate as PremiumGate };
