"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { SajuPillarGroup } from "@/components/saju/SajuPillarGroup";
import { OhengChart } from "@/components/saju/OhengChart";
import { InterpretCard } from "@/components/saju/InterpretCard";
import { LoadingBook } from "@/components/decorative/LoadingBook";
import { GoldButton } from "@/components/ui/GoldButton";
import { GoldCard } from "@/components/ui/GoldCard";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useSajuReading } from "@/hooks/useSajuReading";
import type { BirthInput } from "@/types/api";

export default function SajuResultPage() {
  const t = useTranslations("SajuResult");
  const router = useRouter();
  const { calculation, text, isStreaming, isComplete, error, startReading } =
    useSajuReading();

  useEffect(() => {
    const stored = sessionStorage.getItem("sajuBirthInput");
    if (!stored) {
      router.push("/saju");
      return;
    }

    try {
      const birthInput: BirthInput = JSON.parse(stored);
      startReading(birthInput);
    } catch {
      router.push("/saju");
    }
  }, [router, startReading]);

  if (!calculation) {
    return (
      <div>
        <Header title={t("title")} showBack />
        {error ? (
          <div className="px-4 py-6">
            <ErrorMessage error={error} errorType="server_error" onRetry={() => {
              const stored = sessionStorage.getItem("sajuBirthInput");
              if (stored) {
                try { startReading(JSON.parse(stored)); } catch { router.push("/saju"); }
              } else { router.push("/saju"); }
            }} />
          </div>
        ) : (
          <LoadingBook message={t("loading")} description={t("loadingDesc")} />
        )}
      </div>
    );
  }

  return (
    <div>
      <Header title={t("title")} showBack showShare />
      <div className="flex flex-col gap-6 px-4 py-6">
        {/* Four Pillars */}
        <GoldCard variant="highlight">
          <SajuPillarGroup calculation={calculation} />
        </GoldCard>

        {/* Oheng Balance */}
        <GoldCard>
          <OhengChart elementCounts={calculation.element_counts} />
        </GoldCard>

        {/* Interpretation */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-gold-300">
            {t("interpretation")}
          </h3>
          {text ? (
            <InterpretCard text={text} isStreaming={isStreaming} />
          ) : error ? (
            <ErrorMessage error={error} errorType="server_error" />
          ) : (
            <LoadingBook
              message={t("loading")}
              description={t("loadingDesc")}
            />
          )}
        </div>

        {/* New Analysis button */}
        {isComplete && (
          <GoldButton
            variant="secondary"
            onClick={() => {
              sessionStorage.removeItem("sajuBirthInput");
              router.push("/saju");
            }}
            className="w-full"
          >
            {t("newAnalysis")}
          </GoldButton>
        )}
      </div>
    </div>
  );
}
