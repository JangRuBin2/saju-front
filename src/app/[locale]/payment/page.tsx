"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { Check, Crown, Star } from "lucide-react";

const PREMIUM_AMOUNT = 9900;

export default function PaymentPage() {
  const t = useTranslations("Payment");
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    try {
      // Create order on server
      const res = await fetch("/api/payments/confirm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          plan: "premium",
          amount: PREMIUM_AMOUNT,
        }),
      });

      const { orderId } = await res.json();

      // Load Toss Payments SDK dynamically
      const { loadTossPayments } = await import("@tosspayments/tosspayments-sdk");
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ""
      );

      const payment = tossPayments.payment({ customerKey: session.user.id });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: PREMIUM_AMOUNT },
        orderId,
        orderName: t("premiumPlan"),
        successUrl: `${window.location.origin}/api/payments/confirm?redirect=true`,
        failUrl: `${window.location.origin}${window.location.pathname.replace(/\/payment$/, "")}/payment/fail`,
      });
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Header title={t("title")} showBack />
      <div className="flex flex-col gap-5 px-4 py-6">
        <p className="text-center text-sm text-gold-500">{t("subtitle")}</p>

        {/* Free Plan */}
        <GoldCard>
          <div className="p-2">
            <div className="flex items-center gap-2 mb-4">
              <Star size={20} className="text-gold-500" strokeWidth={1.5} />
              <h3 className="text-base font-semibold text-gold-300">
                {t("freePlan")}
              </h3>
            </div>
            <ul className="space-y-2">
              {(["free1", "free2", "free3"] as const).map((key) => (
                <li key={key} className="flex items-center gap-2 text-sm text-gold-500">
                  <Check size={14} className="text-gold-600" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </GoldCard>

        {/* Premium Plan */}
        <GoldCard variant="highlight">
          <div className="p-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown size={20} className="text-gold-400" strokeWidth={1.5} />
                <h3 className="text-base font-semibold text-gold-300">
                  {t("premiumPlan")}
                </h3>
              </div>
              <span className="text-sm font-bold text-gold-gradient">
                {t("monthlyPrice")}
              </span>
            </div>
            <ul className="space-y-2 mb-6">
              {(["premium1", "premium2", "premium3"] as const).map((key) => (
                <li key={key} className="flex items-center gap-2 text-sm text-gold-400">
                  <Check size={14} className="text-gold-400" />
                  {t(key)}
                </li>
              ))}
            </ul>
            <GoldButton
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "..." : t("subscribe")}
            </GoldButton>
          </div>
        </GoldCard>
      </div>
    </div>
  );
}
