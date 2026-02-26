"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldFrame } from "@/components/decorative/GoldFrame";
import { User, BookOpen } from "lucide-react";

export default function MyPage() {
  const t = useTranslations("MyPage");

  return (
    <div>
      <Header title={t("title")} showBack />
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        <GoldFrame size="lg">
          <User size={36} className="text-gold-500" strokeWidth={1.5} />
        </GoldFrame>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gold-300">{t("title")}</h2>
          <p className="text-sm text-gold-600 mt-1">{t("subtitle")}</p>
        </div>

        <GoldCard className="w-full text-center py-12">
          <BookOpen size={40} className="mx-auto text-gold-600 mb-4" strokeWidth={1} />
          <p className="text-sm text-gold-500">{t("comingSoon")}</p>
        </GoldCard>
      </div>
    </div>
  );
}
