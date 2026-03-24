"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CounselorAvatar } from "./CounselorAvatar";
import { COUNSELORS } from "@/lib/counselor-data";
import type { Counselor } from "@/types/counselor";

interface CounselorPickerProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CounselorPicker({ selectedId, onSelect }: CounselorPickerProps) {
  const t = useTranslations("Counselor");

  return (
    <div className="mb-5">
      <p className="text-sm text-gold-400 font-medium mb-1">{t("selectTitle")}</p>
      <p className="text-xs text-gold-100/50 mb-3">{t("selectDescription")}</p>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {COUNSELORS.map((counselor) => (
          <CounselorCard
            key={counselor.id}
            counselor={counselor}
            isSelected={selectedId === counselor.id}
            onSelect={() => onSelect(counselor.id)}
            t={t}
          />
        ))}
      </div>
      <p className="text-[10px] text-gold-100/30 mt-2">{t("aiNotice")}</p>
    </div>
  );
}

function CounselorCard({
  counselor,
  isSelected,
  onSelect,
  t,
}: {
  counselor: Counselor;
  isSelected: boolean;
  onSelect: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const isPremium = counselor.tier === "premium";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-lg border min-w-[100px] transition-all duration-200 ${
        isSelected
          ? "border-gold-400/60 bg-gold-500/10 shadow-[0_0_12px_rgba(255,215,0,0.15)]"
          : "border-gold-600/20 bg-midnight-800/40 hover:border-gold-500/30"
      }`}
    >
      {isPremium && (
        <span className="absolute -top-2 right-1 text-[9px] bg-gold-500/90 text-midnight-900 font-bold px-1.5 py-0.5 rounded-full">
          {t("premiumBadge")}
        </span>
      )}
      <CounselorAvatar counselor={counselor} size={56} showAiBadge={false} />
      <span className="text-xs font-semibold text-gold-200 whitespace-nowrap">
        {t(counselor.nameKey)}
      </span>
      <span className="text-[10px] text-gold-100/50 whitespace-nowrap">
        {t(counselor.titleKey)}
      </span>
    </motion.button>
  );
}
