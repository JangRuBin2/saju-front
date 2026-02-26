"use client";

import { useTranslations } from "next-intl";
import { SajuPillar } from "./SajuPillar";
import type { SajuCalculateResponse } from "@/types/api";

interface SajuPillarGroupProps {
  calculation: SajuCalculateResponse;
}

export function SajuPillarGroup({ calculation }: SajuPillarGroupProps) {
  const t = useTranslations("SajuResult");

  const pillarEntries = [
    ...(calculation.time_pillar
      ? [{ key: "time", label: t("time"), data: calculation.time_pillar }]
      : []),
    { key: "day", label: t("day"), data: calculation.day_pillar },
    { key: "month", label: t("month"), data: calculation.month_pillar },
    { key: "year", label: t("year"), data: calculation.year_pillar },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-base font-semibold text-gold-300">
        {t("fourPillars")}
      </h3>
      <div className="flex justify-center gap-4">
        {pillarEntries.map((entry, i) => (
          <SajuPillar
            key={entry.key}
            label={entry.label}
            pillar={entry.data}
            index={i}
          />
        ))}
      </div>
      <p className="text-xs text-gold-600">
        {t("dayMaster")}: {calculation.day_master} ({calculation.day_master_kor}) - {calculation.day_master_element}
      </p>
    </div>
  );
}
