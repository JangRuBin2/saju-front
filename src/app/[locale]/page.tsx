"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldFrame } from "@/components/decorative/GoldFrame";
import { Compass, Sun, Heart, User } from "lucide-react";

const MENU_CARDS = [
  { key: "saju", href: "/saju", icon: Compass, titleKey: "sajuCard", descKey: "sajuDesc" },
  { key: "today", href: "/today", icon: Sun, titleKey: "todayCard", descKey: "todayDesc" },
  { key: "compat", href: "/compatibility", icon: Heart, titleKey: "compatCard", descKey: "compatDesc" },
  { key: "my", href: "/mypage", icon: User, titleKey: "myCard", descKey: "myDesc" },
] as const;

export default function HomePage() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-col items-center px-4 pt-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 mb-12"
      >
        <GoldFrame size="lg">
          <span className="text-4xl font-serif text-gold-gradient">命</span>
        </GoldFrame>
        <h1 className="text-3xl font-bold text-gold-gradient">{t("title")}</h1>
        <p className="text-sm text-gold-500 text-center max-w-xs">
          {t("subtitle")}
        </p>
      </motion.div>

      {/* Menu cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {MENU_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link href={card.href}>
                <GoldCard variant="interactive" className="flex flex-col items-center gap-3 py-8">
                  <Icon size={28} className="text-gold-400" strokeWidth={1.5} />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gold-300">
                      {t(card.titleKey)}
                    </p>
                    <p className="text-xs text-gold-600 mt-1">
                      {t(card.descKey)}
                    </p>
                  </div>
                </GoldCard>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
