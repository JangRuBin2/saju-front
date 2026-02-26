"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { SajuForm } from "@/components/saju/SajuForm";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { LoadingBook } from "@/components/decorative/LoadingBook";
import { InterpretCard } from "@/components/saju/InterpretCard";
import { useDailyFortune } from "@/hooks/useDailyFortune";
import type { BirthInput } from "@/types/api";

export default function TodayPage() {
  const t = useTranslations("Today");
  const { fortune, isLoading, error, fetchFortune, reset } = useDailyFortune();

  const handleSubmit = (birthInput: BirthInput) => {
    const now = new Date();
    fetchFortune({
      birth: birthInput,
      target_year: now.getFullYear(),
      target_month: now.getMonth() + 1,
      target_day: now.getDate(),
    });
  };

  if (fortune) {
    return (
      <div>
        <Header title={t("title")} showBack />
        <div className="flex flex-col gap-4 px-4 py-6">
          {/* Date */}
          <GoldCard variant="highlight" className="text-center">
            <p className="text-sm text-gold-500 mb-1">{t("overallLuck")}</p>
            <p className="text-lg font-semibold text-gold-300">
              {fortune.target_date}
            </p>
          </GoldCard>

          {/* Interpretation */}
          <InterpretCard text={fortune.interpretation} />

          <GoldButton variant="secondary" onClick={reset} className="w-full">
            {t("checkFortune")}
          </GoldButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={t("title")} showBack />
      <div className="px-4 py-6">
        <p className="text-center text-sm text-gold-500 mb-6">
          {t("subtitle")}
        </p>
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {isLoading ? (
          <LoadingBook message={t("checkFortune")} />
        ) : (
          <SajuForm
            onSubmit={handleSubmit}
            loading={isLoading}
            submitLabel={t("checkFortune")}
          />
        )}
      </div>
    </div>
  );
}
