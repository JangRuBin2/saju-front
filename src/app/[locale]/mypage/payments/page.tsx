"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { CreditCard } from "lucide-react";

interface PaymentRecord {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  usedAt: string | null;
  createdAt: string;
  readingType: {
    name: string;
  };
}

const STATUS_LABELS: Record<string, { text: string; className: string }> = {
  pending: { text: "대기", className: "text-yellow-400 bg-yellow-400/10" },
  paid: { text: "미사용", className: "text-green-400 bg-green-400/10" },
  used: { text: "사용완료", className: "text-gold-600 bg-gold-600/10" },
  canceled: { text: "취소", className: "text-red-400 bg-red-400/10" },
  refunded: { text: "환불", className: "text-red-400 bg-red-400/10" },
};

export default function PaymentsPage() {
  const t = useTranslations("MyPage");
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments/confirm?list=true")
      .then((res) => res.json())
      .then((data) => {
        setPayments(data.payments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <Header title={t("paymentHistory")} showBack />
      <div className="px-4 py-6">
        {loading ? (
          <p className="text-center text-sm text-gold-500">{t("loading")}</p>
        ) : payments.length === 0 ? (
          <GoldCard className="text-center py-12">
            <CreditCard size={32} className="mx-auto text-gold-600 mb-3" strokeWidth={1} />
            <p className="text-sm text-gold-500">{t("noPayments")}</p>
          </GoldCard>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => {
              const statusInfo = STATUS_LABELS[payment.status] || {
                text: payment.status,
                className: "text-gold-600 bg-gold-600/10",
              };

              return (
                <GoldCard key={payment.id}>
                  <div className="flex items-center justify-between p-2">
                    <div>
                      <p className="text-sm font-medium text-gold-300">
                        {payment.readingType.name}
                      </p>
                      <p className="text-xs text-gold-600">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <p className="text-sm font-medium text-gold-400">
                        {payment.amount.toLocaleString()}원
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded ${statusInfo.className}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                </GoldCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
