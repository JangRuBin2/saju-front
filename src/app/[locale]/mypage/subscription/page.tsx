"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { Link } from "@/i18n/navigation";
import { Crown, Star, Check, Clock } from "lucide-react";
import { LoadingBook } from "@/components/decorative/LoadingBook";

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

  const getRemainingDays = () => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (loading) {
    return (
      <div>
        <Header title={tMyPage("subscription")} showBack />
        <LoadingBook message={tMyPage("loading")} />
      </div>
    );
  }

  const remainingDays = getRemainingDays();

  return (
    <div>
      <Header title={tMyPage("subscription")} showBack />
      <div className="flex flex-col gap-5 px-4 py-6">
        {/* Current Plan Card */}
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
            {tier === "premium" && endDate && (
              <div className="flex items-center gap-2 text-sm text-gold-500">
                <Clock size={14} />
                <span>
                  ~ {new Date(endDate).toLocaleDateString()} ({remainingDays}일 남음)
                </span>
              </div>
            )}
          </div>
        </GoldCard>

        {/* Features List */}
        <GoldCard>
          <h3 className="text-sm font-semibold text-gold-300 mb-3">
            {tier === "premium" ? t("premiumPlan") : t("freePlan")} 포함 기능
          </h3>
          <ul className="space-y-2.5">
            {tier === "premium" ? (
              <>
                <li className="flex items-center gap-2.5 text-sm text-gold-400">
                  <Check size={14} className="text-gold-400 shrink-0" /> {t("premium1")}
                </li>
                <li className="flex items-center gap-2.5 text-sm text-gold-400">
                  <Check size={14} className="text-gold-400 shrink-0" /> {t("premium2")}
                </li>
                <li className="flex items-center gap-2.5 text-sm text-gold-400">
                  <Check size={14} className="text-gold-400 shrink-0" /> {t("premium3")}
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-2.5 text-sm text-gold-500">
                  <Check size={14} className="text-gold-600 shrink-0" /> {t("free1")}
                </li>
                <li className="flex items-center gap-2.5 text-sm text-gold-500">
                  <Check size={14} className="text-gold-600 shrink-0" /> {t("free2")}
                </li>
                <li className="flex items-center gap-2.5 text-sm text-gold-500">
                  <Check size={14} className="text-gold-600 shrink-0" /> {t("free3")}
                </li>
              </>
            )}
          </ul>
        </GoldCard>

        {/* Action Button */}
        {tier === "free" ? (
          <Link href="/payment">
            <GoldButton className="w-full">{t("subscribe")}</GoldButton>
          </Link>
        ) : (
          <p className="text-xs text-gold-600 text-center">
            구독 해지는 결제일 전에 마이페이지에서 가능합니다.
          </p>
        )}
      </div>
    </div>
  );
}
