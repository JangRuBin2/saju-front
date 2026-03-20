"use client";

import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { PetBirthForm } from "@/components/saju/PetBirthForm";
import { InterpretCard } from "@/components/saju/InterpretCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingBook } from "@/components/decorative/LoadingBook";
import { usePetReading } from "@/hooks/usePetReading";
import type { PetBirthInput, PetReadingResponse } from "@/types/api";

export default function PetFortunePage() {
  const t = useTranslations("Pet");
  const { result, isLoading, error, fetchReading, reset } = usePetReading();

  const handleSubmit = (pet: PetBirthInput) => {
    fetchReading("yearly_fortune", {
      pet,
      target_year: new Date().getFullYear(),
    });
  };

  const petResult = result as PetReadingResponse | null;

  if (petResult) {
    return (
      <div>
        <Header title={t("fortuneTitle")} showBack />
        <div className="flex flex-col gap-4 px-4 py-6">
          <InterpretCard interpretation={petResult.interpretation} />
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
      <Header title={t("fortuneTitle")} showBack />
      <div className="px-4 py-6">
        <p className="text-center text-sm text-gold-500 mb-6">
          {t("fortuneSubtitle")}
        </p>
        {error && <ErrorMessage error={error} onRetry={reset} />}
        {isLoading ? (
          <LoadingBook message={t("analyzing")} />
        ) : (
          <PetBirthForm onSubmit={handleSubmit} loading={isLoading} />
        )}
      </div>
    </div>
  );
}
