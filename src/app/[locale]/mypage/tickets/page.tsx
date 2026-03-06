"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { Link } from "@/i18n/navigation";
import { Ticket } from "lucide-react";
import { LoadingBook } from "@/components/decorative/LoadingBook";

interface TicketItem {
  id: string;
  createdAt: string;
  readingType: {
    code: string;
    name: string;
    description: string | null;
  };
}

export default function TicketsPage() {
  const t = useTranslations("MyPage");
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.tickets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Header title={t("unusedTickets")} showBack />
        <LoadingBook message={t("loading")} />
      </div>
    );
  }

  return (
    <div>
      <Header title={t("unusedTickets")} showBack />
      <div className="px-4 py-6">
        {tickets.length === 0 ? (
          <GoldCard className="text-center py-12">
            <Ticket size={32} className="mx-auto text-gold-600 mb-3" strokeWidth={1} />
            <p className="text-sm text-gold-500 mb-4">{t("noTickets")}</p>
            <Link href="/payment">
              <GoldButton size="sm">{t("purchaseTicket")}</GoldButton>
            </Link>
          </GoldCard>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <GoldCard key={ticket.id}>
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-3">
                    <Ticket size={18} className="text-gold-400 shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-gold-300">
                        {ticket.readingType.name}
                      </p>
                      <p className="text-xs text-gold-600">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                    {t("ticketUnused")}
                  </span>
                </div>
              </GoldCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
