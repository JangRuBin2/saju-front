"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { Link } from "@/i18n/navigation";
import { Crown, Star } from "lucide-react";

export default function SubscriptionPage() {
  const t = useTranslations("Payment");
  const tMyPage = useTranslations("MyPage");
  const [tier, setTier] = useState<"free" | "premium">("free");
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments/confirm?tier=true")
      .then((res) => res.json())
      .then((data) => {
        setTier(data.tier || "free");
        setEndDate(data.endDate || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Header title={tMyPage("subscription")} showBack />
        <div className="px-4 py-6 text-center text-sm text-gold-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={tMyPage("subscription")} showBack />
      <div className="flex flex-col gap-5 px-4 py-6">
        <GoldCard variant={tier === "premium" ? "highlight" : "default"}>
          <div className="flex flex-col items-center gap-3 py-6">
            {tier === "premium" ? (
              <Crown size={36} className="text-gold-400" strokeWidth={1.5} />
            ) : (
              <Star size={36} className="text-gold-600" strokeWidth={1.5} />
            )}
            <h2 className="text-lg font-semibold text-gold-300">
              {t("currentPlan")}: {tier === "premium" ? t("premiumPlan") : t("freePlan")}
            </h2>
            {endDate && (
              <p className="text-xs text-gold-500">
                ~ {new Date(endDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </GoldCard>

        {tier === "free" && (
          <Link href="/payment">
            <GoldButton className="w-full">{t("subscribe")}</GoldButton>
          </Link>
        )}
      </div>
    </div>
  );
}
