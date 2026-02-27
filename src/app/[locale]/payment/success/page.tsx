"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { GoldFrame } from "@/components/decorative/GoldFrame";
import { Link } from "@/i18n/navigation";
import { Check } from "lucide-react";

export default function PaymentSuccessPage() {
  const t = useTranslations("Payment");

  return (
    <div>
      <Header title={t("success")} />
      <div className="flex flex-col items-center gap-6 px-4 pt-12">
        <GoldFrame size="lg">
          <Check size={36} className="text-green-400" strokeWidth={2} />
        </GoldFrame>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gold-gradient">{t("success")}</h1>
          <p className="mt-2 text-sm text-gold-500">{t("successMessage")}</p>
        </div>

        <GoldCard className="w-full text-center py-8">
          <p className="text-sm text-gold-400">{t("premiumPlan")}</p>
        </GoldCard>

        <Link href="/" className="w-full max-w-sm">
          <GoldButton className="w-full">{t("goHome")}</GoldButton>
        </Link>
      </div>
    </div>
  );
}
