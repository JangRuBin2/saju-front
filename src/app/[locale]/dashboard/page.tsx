"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { GoldFrame } from "@/components/decorative/GoldFrame";
import { Link } from "@/i18n/navigation";
import {
  Compass,
  Sun,
  Heart,
  Calendar,
  Ticket,
  BookOpen,
  Sparkles,
  TrendingUp,
  Activity,
  Briefcase,
  ChevronRight,
} from "lucide-react";

const FORTUNE_CATEGORIES = [
  { key: "overall", labelKey: "overall", icon: Sparkles, color: "text-gold-400" },
  { key: "love", labelKey: "love", icon: Heart, color: "text-pink-400" },
  { key: "wealth", labelKey: "wealth", icon: TrendingUp, color: "text-emerald-400" },
  { key: "health", labelKey: "health", icon: Activity, color: "text-blue-400" },
  { key: "career", labelKey: "career", icon: Briefcase, color: "text-violet-400" },
] as const;

const QUICK_ACTIONS = [
  { key: "saju", href: "/saju", icon: Compass, labelKey: "quickSaju" },
  { key: "today", href: "/today", icon: Sun, labelKey: "quickToday" },
  { key: "compatibility", href: "/compatibility", icon: Heart, labelKey: "quickCompat" },
  { key: "monthly", href: "/today", icon: Calendar, labelKey: "quickMonthly" },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const { data: session } = useSession();

  const displayName =
    session?.user?.name || session?.user?.email?.split("@")[0] || t("guest");
  const _ = session; // session used for display name above

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header title={t("title")} />

      <motion.div
        className="mx-auto max-w-lg px-4 py-6 pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── User Profile Summary ── */}
        <motion.section variants={itemVariants} className="flex flex-col items-center gap-4 mb-8">
          <GoldFrame size="lg">
            <span className="text-4xl font-serif text-gold-gradient">命</span>
          </GoldFrame>

          <div className="text-center">
            <h2 className="text-xl font-bold text-gold-gradient">
              {t("welcome", { name: displayName })}
            </h2>
            <p className="text-sm text-gold-500 mt-1">{t("welcomeSubtitle")}</p>
          </div>
        </motion.section>

        {/* ── Today's Fortune Overview ── */}
        <motion.section variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gold-300">{t("todayFortune")}</h3>
            <Link
              href="/today"
              className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors"
            >
              {t("viewAll")}
              <ChevronRight size={14} />
            </Link>
          </div>

          <GoldCard variant="interactive">
            <Link href="/today">
              <div className="flex items-center justify-between gap-2">
                {FORTUNE_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.key}
                      className="flex flex-col items-center gap-1.5 flex-1"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-midnight-800/80 border border-gold-600/20">
                        <Icon size={18} className={cat.color} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] text-gold-500 whitespace-nowrap">
                        {t(cat.labelKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Link>
          </GoldCard>
        </motion.section>

        {/* ── Quick Actions ── */}
        <motion.section variants={itemVariants} className="mb-6">
          <h3 className="text-sm font-semibold text-gold-300 mb-3">{t("quickActions")}</h3>

          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.key}
                  variants={itemVariants}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link href={action.href}>
                    <GoldCard
                      variant="interactive"
                      className="flex flex-col items-center gap-2.5 py-6 relative"
                    >
                      <Icon size={24} className="text-gold-400" strokeWidth={1.5} />
                      <span className="text-xs font-medium text-gold-300">
                        {t(action.labelKey)}
                      </span>
                    </GoldCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Ticket Purchase Banner ── */}
        <motion.section variants={itemVariants} className="mb-6">
          <Link href="/payment">
            <GoldCard
              variant="highlight"
              className="relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold-600/10 via-gold-500/5 to-transparent pointer-events-none" />
              <div className="relative flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gold-500/15 border border-gold-500/30 shrink-0">
                  <Ticket size={22} className="text-gold-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gold-300">
                    {t("ticketTitle")}
                  </p>
                  <p className="text-xs text-gold-500 mt-0.5">
                    {t("ticketDesc")}
                  </p>
                </div>
                <GoldButton size="sm">{t("purchase")}</GoldButton>
              </div>
            </GoldCard>
          </Link>
        </motion.section>

        {/* ── Recent Activity ── */}
        <motion.section variants={itemVariants}>
          <h3 className="text-sm font-semibold text-gold-300 mb-3">{t("recentActivity")}</h3>

          <GoldCard className="flex flex-col items-center gap-3 py-8">
            <BookOpen size={28} className="text-gold-600" strokeWidth={1.5} />
            <p className="text-sm text-gold-500">{t("noActivity")}</p>
          </GoldCard>
        </motion.section>
      </motion.div>
    </div>
  );
}
