"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { SajuForm } from "@/components/saju/SajuForm";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingBook } from "@/components/decorative/LoadingBook";
import { SajuPillarGroup } from "@/components/saju/SajuPillarGroup";
import { InterpretCard } from "@/components/saju/InterpretCard";
import { useCompatibility } from "@/hooks/useCompatibility";
import type { BirthInput } from "@/types/api";

export default function CompatibilityPage() {
  const t = useTranslations("Compatibility");
  const { result, isLoading, error, checkCompatibility, reset } =
    useCompatibility();
  const [person1, setPerson1] = useState<BirthInput | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const handlePerson1Submit = (data: BirthInput) => {
    setPerson1(data);
    setStep(2);
  };

  const handlePerson2Submit = (data: BirthInput) => {
    if (!person1) return;
    checkCompatibility({
      person1,
      person2: data,
    });
  };

  const handleReset = () => {
    setPerson1(null);
    setStep(1);
    reset();
  };

  if (isLoading) {
    return (
      <div>
        <Header title={t("title")} showBack />
        <LoadingBook message={t("checkCompat")} />
      </div>
    );
  }

  if (result) {
    return (
      <div>
        <Header title={t("title")} showBack />
        <div className="flex flex-col gap-5 px-4 py-6">
          {/* Person 1 Pillars */}
          <GoldCard variant="highlight">
            <p className="text-xs text-gold-500 mb-3 text-center">
              {t("person1")}
            </p>
            <SajuPillarGroup calculation={result.person1} />
          </GoldCard>

          {/* Person 2 Pillars */}
          <GoldCard variant="highlight">
            <p className="text-xs text-gold-500 mb-3 text-center">
              {t("person2")}
            </p>
            <SajuPillarGroup calculation={result.person2} />
          </GoldCard>

          {/* Interpretation */}
          <InterpretCard interpretation={result.interpretation} />

          <GoldButton
            variant="secondary"
            onClick={handleReset}
            className="w-full"
          >
            {t("checkCompat")}
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
          <ErrorMessage error={error} onRetry={handleReset} />
        )}

        {step === 1 ? (
          <div>
            <p className="text-center text-sm text-gold-400 font-medium mb-4">
              {t("person1")}
            </p>
            <SajuForm onSubmit={handlePerson1Submit} showCounselorPicker={false} />
          </div>
        ) : (
          <div>
            <p className="text-center text-sm text-gold-400 font-medium mb-4">
              {t("person2")}
            </p>
            <SajuForm
              onSubmit={handlePerson2Submit}
              loading={isLoading}
              submitLabel={t("checkCompat")}
              showCounselorPicker={false}
            />
            <button
              onClick={() => setStep(1)}
              className="mt-3 text-sm text-gold-600 hover:text-gold-400 transition-colors w-full text-center"
            >
              {t("person1")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
