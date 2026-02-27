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
  plan: string;
  createdAt: string;
}

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
            {payments.map((payment) => (
              <GoldCard key={payment.id}>
                <div className="flex items-center justify-between p-2">
                  <div>
                    <p className="text-sm font-medium text-gold-300">
                      {payment.plan}
                    </p>
                    <p className="text-xs text-gold-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gold-400">
                      {payment.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gold-600">{payment.status}</p>
                  </div>
                </div>
              </GoldCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
