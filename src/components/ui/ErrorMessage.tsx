"use client";

import { useTranslations } from "next-intl";
import { GoldCard } from "./GoldCard";
import { GoldButton } from "./GoldButton";
import { AlertTriangle, WifiOff, ServerCrash } from "lucide-react";

interface ErrorMessageProps {
  error: string;
  errorType?: string | null;
  onRetry?: () => void;
}

export function ErrorMessage({ error, errorType, onRetry }: ErrorMessageProps) {
  const t = useTranslations("Common");

  const Icon = errorType === "server_error" ? ServerCrash :
               errorType === "network_error" ? WifiOff : AlertTriangle;

  return (
    <GoldCard className="text-center py-6">
      <Icon size={28} className="mx-auto text-red-400 mb-3" strokeWidth={1.5} />
      <p className="text-sm text-red-400 mb-3">{error}</p>
      {onRetry && (
        <GoldButton variant="secondary" onClick={onRetry} className="mx-auto">
          {t("retry")}
        </GoldButton>
      )}
    </GoldCard>
  );
}
