"use client";

import { useEffect, useState, Suspense } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { GoldFrame } from "@/components/decorative/GoldFrame";
import { motion } from "framer-motion";
import { Ticket, Shield, ChevronDown, Sparkles } from "lucide-react";

interface ReadingTypeItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price: number;
}

function getPriceTag(price: number): string {
  return `${price.toLocaleString()}원`;
}

function PaymentContent() {
  const t = useTranslations("Payment");
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get("type");

  const [readingTypes, setReadingTypes] = useState<ReadingTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/reading-types")
      .then((res) => res.json())
      .then((data) => {
        setReadingTypes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePurchase = async (readingType: ReadingTypeItem) => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    setProcessingId(readingType.id);
    try {
      const res = await fetch("/api/payments/confirm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          readingTypeId: readingType.id,
          amount: readingType.price,
        }),
      });

      const { orderId } = await res.json();

      const { loadTossPayments } = await import("@tosspayments/tosspayments-sdk");
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ""
      );

      const payment = tossPayments.payment({ customerKey: session.user.id });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: readingType.price },
        orderId,
        orderName: readingType.name,
        successUrl: `${window.location.origin}/api/payments/confirm?redirect=true`,
        failUrl: `${window.location.origin}${window.location.pathname.replace(/\/payment$/, "")}/payment/fail`,
      });
    } catch {
      setProcessingId(null);
    }
  };

  const faqItems = [
    { question: t("faqQ1"), answer: t("faqA1") },
    { question: t("faqQ2"), answer: t("faqA2") },
    { question: t("faqQ3"), answer: t("faqA3") },
  ];

  // Group by price tier
  const grouped = {
    standard: readingTypes.filter((rt) => rt.price <= 1100),
    premium: readingTypes.filter((rt) => rt.price > 1100 && rt.price <= 3300),
    deluxe: readingTypes.filter((rt) => rt.price > 3300),
  };

  return (
    <div className="min-h-screen bg-midnight-950">
      <Header title={t("title")} showBack />

      <div className="mx-auto max-w-lg px-4 pb-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 pt-8 pb-6"
        >
          <GoldFrame size="md">
            <Ticket size={36} className="text-gold-400" strokeWidth={1.5} />
          </GoldFrame>
          <h2 className="text-2xl font-bold text-gold-gradient">{t("title")}</h2>
          <p className="text-sm text-gold-500 text-center max-w-xs">{t("subtitle")}</p>
        </motion.div>

        {loading ? (
          <div className="text-center text-sm text-gold-500 py-12">{t("loading")}</div>
        ) : (
          <div className="space-y-6">
            {/* Standard tier */}
            {grouped.standard.length > 0 && (
              <ReadingTypeGroup
                items={grouped.standard}
                processingId={processingId}
                preselectedType={preselectedType}
                onPurchase={handlePurchase}
              />
            )}

            {/* Premium tier */}
            {grouped.premium.length > 0 && (
              <ReadingTypeGroup
                items={grouped.premium}
                processingId={processingId}
                preselectedType={preselectedType}
                onPurchase={handlePurchase}
              />
            )}

            {/* Deluxe tier */}
            {grouped.deluxe.length > 0 && (
              <ReadingTypeGroup
                items={grouped.deluxe}
                processingId={processingId}
                preselectedType={preselectedType}
                onPurchase={handlePurchase}
              />
            )}
          </div>
        )}

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-2 mt-10 mb-10"
        >
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Sparkles key={star} size={14} className="text-gold-500" strokeWidth={1.5} />
            ))}
            <span className="text-xs text-gold-600 ml-1">{t("rating")}</span>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-gold-500" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-gold-400">{t("faq")}</h3>
          </div>
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-gold-600/20 bg-midnight-800/40 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm text-gold-400">{item.question}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gold-600 shrink-0 transition-transform ${
                      openFaqIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <p className="px-4 pb-3 text-xs leading-relaxed text-gold-600">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ReadingTypeGroup({
  items,
  processingId,
  preselectedType,
  onPurchase,
}: {
  items: ReadingTypeItem[];
  processingId: string | null;
  preselectedType: string | null;
  onPurchase: (rt: ReadingTypeItem) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((rt, i) => (
        <motion.div
          key={rt.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
        >
          <GoldCard
            variant={preselectedType === rt.code ? "highlight" : "default"}
            className="flex items-center justify-between p-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gold-300">{rt.name}</p>
              {rt.description && (
                <p className="text-xs text-gold-600 mt-0.5">{rt.description}</p>
              )}
            </div>
            <GoldButton
              size="sm"
              onClick={() => onPurchase(rt)}
              disabled={processingId === rt.id}
              loading={processingId === rt.id}
              className="ml-3 shrink-0"
            >
              {getPriceTag(rt.price)}
            </GoldButton>
          </GoldCard>
        </motion.div>
      ))}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentContent />
    </Suspense>
  );
}
