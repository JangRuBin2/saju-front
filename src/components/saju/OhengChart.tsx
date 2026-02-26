"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { OHENG_LIST } from "@/types/saju";

interface OhengChartProps {
  elementCounts: Record<string, number>;
}

export function OhengChart({ elementCounts }: OhengChartProps) {
  const t = useTranslations("SajuResult");
  const total =
    Object.values(elementCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-semibold text-gold-300 text-center">
        {t("ohengTitle")}
      </h3>
      <div className="flex flex-col gap-3">
        {OHENG_LIST.map((config) => {
          const value = elementCounts[config.key] || 0;
          const percentage = Math.round((value / total) * 100);

          return (
            <div key={config.key} className="flex items-center gap-3">
              <span
                className="w-14 text-sm font-medium text-right"
                style={{ color: config.color }}
              >
                {config.label}({config.key})
              </span>
              <div className="flex-1 h-5 rounded-full bg-midnight-700/50 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: config.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <span className="w-10 text-xs text-gold-500 text-right">
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
