"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SajuForm } from "@/components/saju/SajuForm";
import { CareerInfoForm } from "@/components/saju/CareerInfoForm";
import { InterpretCard } from "@/components/saju/InterpretCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingBook } from "@/components/decorative/LoadingBook";
import { useCareerReading } from "@/hooks/useCareerReading";
import type { BirthInput, CareerInfo } from "@/types/api";

type CareerType = "transition" | "stay_or_go" | "startup" | "burnout";

interface CareerReadingPageProps {
  type: CareerType;
  titleKey: string;
  subtitleKey: string;
}

export function CareerReadingPage({
  type,
  titleKey,
  subtitleKey,
}: CareerReadingPageProps) {
  const t = useTranslations("Career");
  const { reading, isLoading, error, fetchReading, reset } = useCareerReading();
  const [careerInfo, setCareerInfo] = useState<CareerInfo>({});

  const handleSubmit = (birth: BirthInput) => {
    fetchReading(type, { birth, career_info: careerInfo });
  };

  if (reading) {
    return (
      <div>
        <Header title={t(titleKey)} showBack />
        <div className="flex flex-col gap-4 px-4 py-6">
          <InterpretCard interpretation={reading.interpretation} />
          <GoldButton
            variant="secondary"
            onClick={reset}
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
      <div className="px-4 py-6 flex flex-col gap-4">
        <p className="text-center text-sm text-gold-500">
          {t(subtitleKey)}
        </p>
        {error && <ErrorMessage error={error} onRetry={reset} />}
        {isLoading ? (
          <LoadingBook message={t("analyzing")} />
        ) : (
          <>
            <CareerInfoForm onChange={setCareerInfo} />
            <SajuForm
              onSubmit={handleSubmit}
              loading={isLoading}
              submitLabel={t("analyze")}
              showCounselorPicker={false}
            />
          </>
        )}
      </div>
    </div>
  );
}
