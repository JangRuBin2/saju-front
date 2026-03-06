"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { GoldCard } from "./GoldCard";
import { GoldButton } from "./GoldButton";
import { Lock, Crown } from "lucide-react";

const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

interface PremiumGateProps {
  errorType: "usage_limit" | "premium_required" | "auth_required";
  message?: string;
}

export function PremiumGate({ errorType, message }: PremiumGateProps) {
  const t = useTranslations("Usage");
  const { data: session } = useSession();

  if (isTestMode) return null;

  if (errorType === "auth_required" || (!session && errorType === "usage_limit")) {
    return (
      <GoldCard className="text-center py-8">
        <Lock size={32} className="mx-auto text-gold-500 mb-3" strokeWidth={1.5} />
        <p className="text-sm font-medium text-gold-300 mb-1">
          {t("loginRequired")}
        </p>
        <p className="text-xs text-gold-600 mb-4">{message}</p>
        <Link href="/login">
          <GoldButton className="mx-auto">{t("loginRequired")}</GoldButton>
        </Link>
      </GoldCard>
    );
  }

  return (
    <GoldCard className="text-center py-8">
      <Crown size={32} className="mx-auto text-gold-400 mb-3" strokeWidth={1.5} />
      <p className="text-sm font-medium text-gold-300 mb-1">
        {errorType === "premium_required"
          ? t("premiumRequired")
          : t("limitReached")}
      </p>
      <p className="text-xs text-gold-600 mb-4">{message}</p>
      <Link href="/payment">
        <GoldButton className="mx-auto">{t("upgradeToPremium")}</GoldButton>
      </Link>
    </GoldCard>
  );
}
