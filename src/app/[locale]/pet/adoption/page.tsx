"use client";

import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SajuForm } from "@/components/saju/SajuForm";
import { InterpretCard } from "@/components/saju/InterpretCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingBook } from "@/components/decorative/LoadingBook";
import { usePetReading } from "@/hooks/usePetReading";
import type { BirthInput, SajuReadingResponse } from "@/types/api";

export default function PetAdoptionPage() {
  const t = useTranslations("Pet");
  const { result, isLoading, error, fetchReading, reset } = usePetReading();

  const handleSubmit = (birth: BirthInput) => {
    fetchReading("adoption_timing", {
      owner: birth,
      target_year: new Date().getFullYear(),
    });
  };

  const adoptionResult = result as SajuReadingResponse | null;

  if (adoptionResult) {
    return (
      <div>
        <Header title={t("adoptionTitle")} showBack />
        <div className="flex flex-col gap-4 px-4 py-6">
          <InterpretCard interpretation={adoptionResult.interpretation} />
          <GoldButton variant="secondary" onClick={reset} className="w-full">
            <RotateCcw size={16} className="mr-2" />
            {t("retry")}
          </GoldButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={t("adoptionTitle")} showBack />
      <div className="px-4 py-6">
        <p className="text-center text-sm text-gold-500 mb-6">
          {t("adoptionSubtitle")}
        </p>
        {error && <ErrorMessage error={error} onRetry={reset} />}
        {isLoading ? (
          <LoadingBook message={t("analyzing")} />
        ) : (
          <>
            <p className="text-center text-sm text-gold-400 font-medium mb-4">
              {t("ownerInfoTitle")}
            </p>
            <SajuForm
              onSubmit={handleSubmit}
              loading={isLoading}
              submitLabel={t("analyze")}
            />
          </>
        )}
      </div>
    </div>
  );
}
