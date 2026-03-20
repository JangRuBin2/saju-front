"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldFrame } from "@/components/decorative/GoldFrame";
import {
  Compass,
  Sun,
  Heart,
  User,
  LayoutDashboard,
  Briefcase,
  ArrowRightLeft,
  Rocket,
  Battery,
  CalendarHeart,
  TrendingUp,
  Coins,
  CalendarCheck,
  PawPrint,
  HeartHandshake,
  Star,
  Clock,
} from "lucide-react";

const TOP_CARDS = [
  { key: "saju", href: "/saju", icon: Compass, titleKey: "sajuCard", descKey: "sajuDesc" },
  { key: "today", href: "/today", icon: Sun, titleKey: "todayCard", descKey: "todayDesc" },
  { key: "compat", href: "/compatibility", icon: Heart, titleKey: "compatCard", descKey: "compatDesc" },
] as const;

const CAREER_CARDS = [
  { key: "career-transition", href: "/career/transition", icon: ArrowRightLeft, titleKey: "careerTransition", descKey: "careerTransitionDesc" },
  { key: "career-stay-or-go", href: "/career/stay-or-go", icon: Briefcase, titleKey: "careerStayOrGo", descKey: "careerStayOrGoDesc" },
  { key: "career-startup", href: "/career/startup", icon: Rocket, titleKey: "careerStartup", descKey: "careerStartupDesc" },
  { key: "career-burnout", href: "/career/burnout", icon: Battery, titleKey: "careerBurnout", descKey: "careerBurnoutDesc" },
] as const;

const MARRIAGE_CARDS = [
  { key: "marriage-timing", href: "/marriage/timing", icon: CalendarHeart, titleKey: "marriageTiming", descKey: "marriageTimingDesc" },
  { key: "marriage-forecast", href: "/marriage/life-forecast", icon: TrendingUp, titleKey: "marriageForecast", descKey: "marriageForecastDesc" },
  { key: "marriage-finance", href: "/marriage/finance", icon: Coins, titleKey: "marriageFinance", descKey: "marriageFinanceDesc" },
  { key: "marriage-dates", href: "/marriage/auspicious-dates", icon: CalendarCheck, titleKey: "marriageDates", descKey: "marriageDatesDesc" },
] as const;

const PET_CARDS = [
  { key: "pet-reading", href: "/pet/reading", icon: PawPrint, titleKey: "petReading", descKey: "petReadingDesc" },
  { key: "pet-compat", href: "/pet/compatibility", icon: HeartHandshake, titleKey: "petCompat", descKey: "petCompatDesc" },
  { key: "pet-fortune", href: "/pet/fortune", icon: Star, titleKey: "petFortune", descKey: "petFortuneDesc" },
  { key: "pet-adoption", href: "/pet/adoption", icon: Clock, titleKey: "petAdoption", descKey: "petAdoptionDesc" },
] as const;

const BOTTOM_CARDS = [
  { key: "dash", href: "/dashboard", icon: LayoutDashboard, titleKey: "dashCard", descKey: "dashDesc" },
  { key: "my", href: "/mypage", icon: User, titleKey: "myCard", descKey: "myDesc" },
] as const;

interface ServiceGridProps {
  cards: readonly { key: string; href: string; icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>; titleKey: string; descKey: string }[];
  t: (key: string) => string;
  delayOffset?: number;
}

function ServiceGrid({ cards, t, delayOffset = 0 }: ServiceGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delayOffset + 0.08 * i }}
          >
            <Link href={card.href}>
              <GoldCard variant="interactive" className="flex flex-col items-center gap-2 py-5">
                <Icon size={22} className="text-gold-400" strokeWidth={1.5} />
                <div className="text-center">
                  <p className="text-xs font-semibold text-gold-300">
                    {t(card.titleKey)}
                  </p>
                  <p className="text-[10px] text-gold-600 mt-0.5 leading-tight">
                    {t(card.descKey)}
                  </p>
                </div>
              </GoldCard>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-gold-400 mt-6 mb-2 w-full max-w-sm">
      {children}
    </h2>
  );
}

export default function HomePage() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-col items-center px-4 pt-12 pb-8">
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

      {/* Main feature cards (3-column) */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-3">
        {TOP_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link href={card.href}>
                <GoldCard variant="interactive" className="flex flex-col items-center gap-3 py-7">
                  <Icon size={26} className="text-gold-400" strokeWidth={1.5} />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gold-300">
                      {t(card.titleKey)}
                    </p>
                    <p className="text-[11px] text-gold-600 mt-1 leading-tight">
                      {t(card.descKey)}
                    </p>
                  </div>
                </GoldCard>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Career section */}
      <SectionTitle>{t("careerSection")}</SectionTitle>
      <ServiceGrid cards={CAREER_CARDS} t={t} delayOffset={0.3} />

      {/* Marriage section */}
      <SectionTitle>{t("marriageSection")}</SectionTitle>
      <ServiceGrid cards={MARRIAGE_CARDS} t={t} delayOffset={0.5} />

      {/* Pet section */}
      <SectionTitle>{t("petSection")}</SectionTitle>
      <ServiceGrid cards={PET_CARDS} t={t} delayOffset={0.7} />

      {/* Utility cards (2-column) */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-6">
        {BOTTOM_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + 0.1 * i }}
            >
              <Link href={card.href}>
                <GoldCard variant="interactive" className="flex flex-col items-center gap-3 py-7">
                  <Icon size={26} className="text-gold-400" strokeWidth={1.5} />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gold-300">
                      {t(card.titleKey)}
                    </p>
                    <p className="text-[11px] text-gold-600 mt-1 leading-tight">
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
