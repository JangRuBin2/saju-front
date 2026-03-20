"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SajuForm } from "@/components/saju/SajuForm";
import { SajuPillarGroup } from "@/components/saju/SajuPillarGroup";
import { InterpretCard } from "@/components/saju/InterpretCard";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingBook } from "@/components/decorative/LoadingBook";
import { useMarriageReading } from "@/hooks/useMarriageReading";
import type { BirthInput } from "@/types/api";

type MarriageType = "timing" | "life_forecast" | "finance" | "auspicious_dates";

interface MarriageReadingPageProps {
  type: MarriageType;
  titleKey: string;
  subtitleKey: string;
}

export function MarriageReadingPage({
  type,
  titleKey,
  subtitleKey,
}: MarriageReadingPageProps) {
  const t = useTranslations("Marriage");
  const { result, isLoading, error, fetchReading, reset } = useMarriageReading();
  const [person1, setPerson1] = useState<BirthInput | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const handlePerson1Submit = (data: BirthInput) => {
    setPerson1(data);
    setStep(2);
  };

  const handlePerson2Submit = (data: BirthInput) => {
    if (!person1) return;
    fetchReading(type, { person1, person2: data });
  };

  const handleReset = () => {
    setPerson1(null);
    setStep(1);
    reset();
  };

  if (isLoading) {
    return (
      <div>
        <Header title={t(titleKey)} showBack />
        <LoadingBook message={t("analyzing")} />
      </div>
    );
  }

  if (result) {
    return (
      <div>
        <Header title={t(titleKey)} showBack />
        <div className="flex flex-col gap-5 px-4 py-6">
          <GoldCard variant="highlight">
            <p className="text-xs text-gold-500 mb-3 text-center">
              {t("person1Label")}
            </p>
            <SajuPillarGroup calculation={result.person1} />
          </GoldCard>

          <GoldCard variant="highlight">
            <p className="text-xs text-gold-500 mb-3 text-center">
              {t("person2Label")}
            </p>
            <SajuPillarGroup calculation={result.person2} />
          </GoldCard>

          <InterpretCard interpretation={result.interpretation} />

          <GoldButton
            variant="secondary"
            onClick={handleReset}
            className="w-full"
          >
            <RotateCcw size={16} className="mr-2" />
            {t("retry")}
          </GoldButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={t(titleKey)} showBack />
      <div className="px-4 py-6">
        <p className="text-center text-sm text-gold-500 mb-6">
          {t(subtitleKey)}
        </p>

        {error && <ErrorMessage error={error} onRetry={handleReset} />}

        {step === 1 ? (
          <div>
            <p className="text-center text-sm text-gold-400 font-medium mb-4">
              {t("person1Label")}
            </p>
            <SajuForm onSubmit={handlePerson1Submit} />
          </div>
        ) : (
          <div>
            <p className="text-center text-sm text-gold-400 font-medium mb-4">
              {t("person2Label")}
            </p>
            <SajuForm
              onSubmit={handlePerson2Submit}
              loading={isLoading}
              submitLabel={t("analyze")}
            />
            <button
              onClick={() => setStep(1)}
              className="mt-3 text-sm text-gold-600 hover:text-gold-400 transition-colors w-full text-center"
            >
              {t("person1Label")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
