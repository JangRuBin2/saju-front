"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { GoldFrame } from "@/components/decorative/GoldFrame";
import { GoldToggle } from "@/components/ui/GoldToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Star,
  Check,
  X,
  ChevronDown,
  Shield,
  Users,
  Sparkles,
} from "lucide-react";

const MONTHLY_AMOUNT = 9900;
const ANNUAL_AMOUNT = 79000;

export default function PaymentPage() {
  const t = useTranslations("Payment");

  const freeFeatures = [
    { text: t("free1"), available: true },
    { text: t("free2"), available: true },
    { text: t("free3"), available: true },
    { text: t("free4"), available: false },
    { text: t("free5"), available: false },
  ];

  const premiumFeatures = [
    { text: t("premium1") },
    { text: t("premium2") },
    { text: t("premium3") },
    { text: t("premium4") },
    { text: t("premium5") },
  ];

  const faqItems = [
    { question: t("faqQ1"), answer: t("faqA1") },
    { question: t("faqQ2"), answer: t("faqA2") },
    { question: t("faqQ3"), answer: t("faqA3") },
  ];
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const isAnnual = billingCycle === "annual";
  const currentAmount = isAnnual ? ANNUAL_AMOUNT : MONTHLY_AMOUNT;
  const monthlyEquivalent = isAnnual
    ? Math.round(ANNUAL_AMOUNT / 12).toLocaleString()
    : null;

  const handleSubscribe = async () => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/payments/confirm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          plan: "premium",
          billingCycle,
          amount: currentAmount,
        }),
      });

      const { orderId } = await res.json();

      const { loadTossPayments } = await import(
        "@tosspayments/tosspayments-sdk"
      );
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ""
      );

      const payment = tossPayments.payment({ customerKey: session.user.id });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: currentAmount },
        orderId,
        orderName: `${t("premiumPlan")} (${isAnnual ? "연간" : "월간"})`,
        successUrl: `${window.location.origin}/api/payments/confirm?redirect=true`,
        failUrl: `${window.location.origin}${window.location.pathname.replace(/\/payment$/, "")}/payment/fail`,
      });
    } catch {
      setIsProcessing(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-midnight-950">
      <Header title={t("title")} showBack />

      <div className="mx-auto max-w-lg px-4 pb-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 pt-8 pb-6"
        >
          <GoldFrame size="md">
            <Crown size={36} className="text-gold-400" strokeWidth={1.5} />
          </GoldFrame>
          <h2 className="text-2xl font-bold text-gold-gradient">
            {t("title")}
          </h2>
          <p className="text-sm text-gold-500 text-center max-w-xs">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Billing Cycle Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <GoldToggle
              options={[
                { value: "monthly", label: t("perMonth").replace("/", "") },
                { value: "annual", label: t("perYear").replace("/", "") },
              ]}
              value={billingCycle}
              onChange={setBillingCycle}
            />
            {billingCycle === "annual" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-3 -right-14 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 px-2 py-0.5 text-[10px] font-bold text-midnight-950 whitespace-nowrap"
              >
                {t("discount")}
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GoldCard className="h-full">
              <div className="p-1">
                <div className="flex items-center gap-2 mb-2">
                  <Star
                    size={20}
                    className="text-gold-500"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-base font-semibold text-gold-300">
                    {t("freePlan")}
                  </h3>
                </div>
                <p className="text-2xl font-bold text-gold-300 mb-5">
                  0원
                  <span className="text-xs font-normal text-gold-600 ml-1">
                    {t("perMonth")}
                  </span>
                </p>
                <ul className="space-y-3 mb-6">
                  {freeFeatures.map((feature, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2.5 text-sm ${
                        feature.available ? "text-gold-500" : "text-gold-700"
                      }`}
                    >
                      {feature.available ? (
                        <Check
                          size={15}
                          className="text-gold-500 shrink-0"
                          strokeWidth={2}
                        />
                      ) : (
                        <X
                          size={15}
                          className="text-gold-700 shrink-0"
                          strokeWidth={2}
                        />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>
                <GoldButton
                  variant="secondary"
                  disabled
                  className="w-full"
                  size="md"
                >
                  {t("currentlyUsing")}
                </GoldButton>
              </div>
            </GoldCard>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            {/* BEST Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <span className="rounded-full bg-gradient-to-r from-gold-600 to-gold-500 px-4 py-1 text-xs font-bold text-midnight-950 shadow-gold">
                {t("best")}
              </span>
            </div>
            <GoldCard variant="highlight" className="h-full">
              <div className="p-1">
                <div className="flex items-center gap-2 mb-2">
                  <Crown
                    size={20}
                    className="text-gold-400"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-base font-semibold text-gold-300">
                    {t("premiumPlan")}
                  </h3>
                </div>
                <div className="mb-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={billingCycle}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isAnnual ? (
                        <>
                          <p className="text-2xl font-bold text-gold-300">
                            {ANNUAL_AMOUNT.toLocaleString()}원
                            <span className="text-xs font-normal text-gold-600 ml-1">
                              {t("perYear")}
                            </span>
                          </p>
                          <p className="text-xs text-gold-500 mt-0.5">
                            {t("monthlyEquiv", { amount: monthlyEquivalent ?? "" })}
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-gold-300">
                          {MONTHLY_AMOUNT.toLocaleString()}원
                          <span className="text-xs font-normal text-gold-600 ml-1">
                            {t("perMonth")}
                          </span>
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <ul className="space-y-3 mb-6">
                  {premiumFeatures.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 text-sm text-gold-400"
                    >
                      <Check
                        size={15}
                        className="text-gold-400 shrink-0"
                        strokeWidth={2}
                      />
                      {feature.text}
                    </li>
                  ))}
                </ul>
                <GoldButton
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  loading={isProcessing}
                  className="w-full"
                  size="md"
                >
                  {isProcessing ? t("subscribe") : t("subscribe")}
                </GoldButton>
              </div>
            </GoldCard>
          </motion.div>
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-2 mb-10"
        >
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gold-500" strokeWidth={1.5} />
            <span className="text-sm font-medium text-gold-400">
              {t("socialProof")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Sparkles
                key={star}
                size={14}
                className="text-gold-500"
                strokeWidth={1.5}
              />
            ))}
            <span className="text-xs text-gold-600 ml-1">{t("rating")}</span>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-gold-500" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-gold-400">
              {t("faq")}
            </h3>
          </div>
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-gold-600/20 bg-midnight-800/40 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm text-gold-400">{item.question}</span>
                  <motion.div
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown
                      size={16}
                      className="text-gold-600 shrink-0"
                    />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-4 pb-3 text-xs leading-relaxed text-gold-600">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
