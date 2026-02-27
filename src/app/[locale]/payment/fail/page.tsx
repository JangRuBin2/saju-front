"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { GoldFrame } from "@/components/decorative/GoldFrame";
import { Link } from "@/i18n/navigation";
import { X } from "lucide-react";

export default function PaymentFailPage() {
  const t = useTranslations("Payment");

  return (
    <div>
      <Header title={t("fail")} />
      <div className="flex flex-col items-center gap-6 px-4 pt-12">
        <GoldFrame size="lg">
          <X size={36} className="text-red-400" strokeWidth={2} />
        </GoldFrame>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gold-300">{t("fail")}</h1>
          <p className="mt-2 text-sm text-gold-500">{t("failMessage")}</p>
        </div>

        <GoldCard className="w-full text-center py-8">
          <p className="text-sm text-red-400">{t("failMessage")}</p>
        </GoldCard>

        <div className="flex gap-3 w-full max-w-sm">
          <Link href="/payment" className="flex-1">
            <GoldButton className="w-full">{t("retry")}</GoldButton>
          </Link>
          <Link href="/" className="flex-1">
            <GoldButton variant="secondary" className="w-full">
              {t("goHome")}
            </GoldButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
