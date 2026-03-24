"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SajuForm } from "@/components/saju/SajuForm";
import { PetBirthForm } from "@/components/saju/PetBirthForm";
import { InterpretCard } from "@/components/saju/InterpretCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingBook } from "@/components/decorative/LoadingBook";
import { usePetReading } from "@/hooks/usePetReading";
import type { BirthInput, PetBirthInput, PetCompatibilityResponse } from "@/types/api";

export default function PetCompatibilityPage() {
  const t = useTranslations("Pet");
  const { result, isLoading, error, fetchReading, reset } = usePetReading();
  const [owner, setOwner] = useState<BirthInput | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const handleOwnerSubmit = (data: BirthInput) => {
    setOwner(data);
    setStep(2);
  };

  const handlePetSubmit = (pet: PetBirthInput) => {
    if (!owner) return;
    fetchReading("compatibility", { owner, pet });
  };

  const handleReset = () => {
    setOwner(null);
    setStep(1);
    reset();
  };

  const compatResult = result as PetCompatibilityResponse | null;

  if (isLoading) {
    return (
      <div>
        <Header title={t("compatibilityTitle")} showBack />
        <LoadingBook message={t("analyzing")} />
      </div>
    );
  }

  if (compatResult) {
    return (
      <div>
        <Header title={t("compatibilityTitle")} showBack />
        <div className="flex flex-col gap-4 px-4 py-6">
          <InterpretCard interpretation={compatResult.interpretation} />
          <GoldButton variant="secondary" onClick={handleReset} className="w-full">
            <RotateCcw size={16} className="mr-2" />
            {t("retry")}
          </GoldButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={t("compatibilityTitle")} showBack />
      <div className="px-4 py-6">
        <p className="text-center text-sm text-gold-500 mb-6">
          {t("compatibilitySubtitle")}
        </p>
        {error && <ErrorMessage error={error} onRetry={handleReset} />}
        {step === 1 ? (
          <div>
            <p className="text-center text-sm text-gold-400 font-medium mb-4">
              {t("ownerInfoTitle")}
            </p>
            <SajuForm onSubmit={handleOwnerSubmit} showCounselorPicker={false} />
          </div>
        ) : (
          <div>
            <p className="text-center text-sm text-gold-400 font-medium mb-4">
              {t("petInfoTitle")}
            </p>
            <PetBirthForm
              onSubmit={handlePetSubmit}
              loading={isLoading}
              submitLabel={t("analyze")}
            />
            <button
              onClick={() => setStep(1)}
              className="mt-3 text-sm text-gold-600 hover:text-gold-400 transition-colors w-full text-center"
            >
              {t("ownerInfoTitle")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
