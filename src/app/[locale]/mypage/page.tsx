"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldFrame } from "@/components/decorative/GoldFrame";
import { Link } from "@/i18n/navigation";
import { User, FileText, CreditCard, Crown, ChevronRight } from "lucide-react";

const MENU_ITEMS = [
  { key: "profile", href: "/mypage/profile", icon: User, labelKey: "profile" },
  { key: "payments", href: "/mypage/payments", icon: CreditCard, labelKey: "paymentHistory" },
  { key: "subscription", href: "/mypage/subscription", icon: Crown, labelKey: "subscription" },
] as const;

export default function MyPage() {
  const t = useTranslations("MyPage");
  const { data: session } = useSession();

  const displayName = session?.user?.name || session?.user?.email?.split("@")[0] || "";

  return (
    <div>
      <Header title={t("title")} showBack />
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        <GoldFrame size="lg">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <User size={36} className="text-gold-500" strokeWidth={1.5} />
          )}
        </GoldFrame>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gold-300">{displayName}</h2>
          <p className="text-sm text-gold-600 mt-1">{session?.user?.email}</p>
        </div>

        <div className="w-full space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.key} href={item.href}>
                <GoldCard variant="interactive" className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-gold-400" strokeWidth={1.5} />
                    <span className="text-sm text-gold-300">{t(item.labelKey)}</span>
                  </div>
                  <ChevronRight size={16} className="text-gold-600" />
                </GoldCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
