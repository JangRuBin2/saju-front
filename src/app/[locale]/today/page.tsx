"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Sun,
  Sparkles,
  Heart,
  CircleDollarSign,
  Activity,
  Briefcase,
  Palette,
  Hash,
  RotateCcw,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SajuForm } from "@/components/saju/SajuForm";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingBook } from "@/components/decorative/LoadingBook";
import { InterpretCard } from "@/components/saju/InterpretCard";
import { useDailyFortune } from "@/hooks/useDailyFortune";
import type { BirthInput } from "@/types/api";

/* ------------------------------------------------------------------ */
/*  Deterministic hash helpers                                         */
/* ------------------------------------------------------------------ */

/** Simple string hash -> unsigned 32-bit integer */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Seeded pseudo-random (mulberry32) returning 0..1 */
function seededRandom(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/*  Lucky data derived from the date string                            */
/* ------------------------------------------------------------------ */

const LUCKY_COLORS: { name: string; tw: string; hex: string }[] = [
  { name: "Red", tw: "bg-red-500", hex: "#ef4444" },
  { name: "Orange", tw: "bg-orange-500", hex: "#f97316" },
  { name: "Yellow", tw: "bg-yellow-400", hex: "#facc15" },
  { name: "Green", tw: "bg-green-500", hex: "#22c55e" },
  { name: "Blue", tw: "bg-blue-500", hex: "#3b82f6" },
  { name: "Purple", tw: "bg-purple-500", hex: "#a855f7" },
  { name: "Pink", tw: "bg-pink-400", hex: "#f472b6" },
  { name: "Gold", tw: "bg-amber-400", hex: "#fbbf24" },
];

function getDayOfWeek(dateStr: string): string {
  // dateStr format assumed: "YYYY-MM-DD" or similar parseable string
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[d.getDay()];
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Category card sub-component                                        */
/* ------------------------------------------------------------------ */

interface CategoryCardProps {
  icon: React.ReactNode;
  label: string;
  stars: number;
  colorClass: string;
}

function CategoryCard({ icon, label, stars, colorClass }: CategoryCardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-gold-600/20 bg-midnight-800/60 px-2 py-3 backdrop-blur-sm flex-1 min-w-0">
      <span className={colorClass}>{icon}</span>
      <span className="text-[11px] text-gold-300 font-medium whitespace-nowrap">
        {label}
      </span>
      <span className="text-amber-400 text-xs tracking-wider leading-none">
        {"★".repeat(stars)}
        <span className="text-gold-800">{"★".repeat(5 - stars)}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function TodayPage() {
  const t = useTranslations("Today");
  const { fortune, isLoading, error, fetchFortune, reset } = useDailyFortune();

  const handleSubmit = (birthInput: BirthInput) => {
    const now = new Date();
    fetchFortune({
      birth: birthInput,
      target_year: now.getFullYear(),
      target_month: now.getMonth() + 1,
      target_day: now.getDate(),
    });
  };

  /* ---------- Derived lucky data (memoised & deterministic) ---------- */

  const luckyData = useMemo(() => {
    if (!fortune) return null;

    const seed = hashString(fortune.target_date);
    const rng = seededRandom(seed);

    // Star ratings: 3-5 for each category
    const stars = Array.from({ length: 5 }, () => Math.floor(rng() * 3) + 3);

    // Lucky colour
    const colorIdx = Math.floor(rng() * LUCKY_COLORS.length);
    const luckyColor = LUCKY_COLORS[colorIdx];

    // Lucky number 1-99
    const luckyNumber = Math.floor(rng() * 99) + 1;

    // Day of week
    const dayOfWeek = getDayOfWeek(fortune.target_date);

    return { stars, luckyColor, luckyNumber, dayOfWeek };
  }, [fortune]);

  /* ---------- Fortune result view ---------- */

  if (fortune && luckyData) {
    const categories = [
      {
        key: "overallLuck" as const,
        icon: <Sparkles size={18} />,
        color: "text-gold-400",
      },
      {
        key: "loveLuck" as const,
        icon: <Heart size={18} />,
        color: "text-pink-400",
      },
      {
        key: "moneyLuck" as const,
        icon: <CircleDollarSign size={18} />,
        color: "text-emerald-400",
      },
      {
        key: "healthLuck" as const,
        icon: <Activity size={18} />,
        color: "text-blue-400",
      },
      {
        key: "workLuck" as const,
        icon: <Briefcase size={18} />,
        color: "text-violet-400",
      },
    ];

    return (
      <div>
        <Header title={t("title")} showBack />

        <motion.div
          className="flex flex-col gap-4 px-4 py-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 1. Date card */}
          <motion.div variants={itemVariants}>
            <GoldCard variant="highlight" className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sun size={18} className="text-gold-400" />
                <p className="text-sm text-gold-500">{t("overallLuck")}</p>
              </div>
              <p className="text-lg font-semibold text-gold-300">
                {fortune.target_date}
                {luckyData.dayOfWeek && (
                  <span className="ml-2 text-sm font-normal text-gold-500">
                    ({luckyData.dayOfWeek})
                  </span>
                )}
              </p>
            </GoldCard>
          </motion.div>

          {/* 2. Fortune category cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-5 gap-2"
          >
            {categories.map((cat, idx) => (
              <CategoryCard
                key={cat.key}
                icon={cat.icon}
                label={t(cat.key)}
                stars={luckyData.stars[idx]}
                colorClass={cat.color}
              />
            ))}
          </motion.div>

          {/* 3. Lucky items section */}
          <motion.div variants={itemVariants}>
            <GoldCard variant="default">
              <div className="flex items-center justify-around">
                {/* Lucky Color */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5 text-gold-500">
                    <Palette size={14} />
                    <span className="text-xs">{t("luckyColor")}</span>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full ring-2 ring-gold-500/30 ${luckyData.luckyColor.tw}`}
                    title={luckyData.luckyColor.name}
                  />
                </div>

                {/* Divider */}
                <div className="h-12 w-px bg-gold-600/20" />

                {/* Lucky Number */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5 text-gold-500">
                    <Hash size={14} />
                    <span className="text-xs">{t("luckyNumber")}</span>
                  </div>
                  <span className="text-2xl font-bold text-gold-300">
                    {luckyData.luckyNumber}
                  </span>
                </div>
              </div>
            </GoldCard>
          </motion.div>

          {/* 4. Interpretation card */}
          <motion.div variants={itemVariants}>
            <InterpretCard interpretation={fortune.interpretation} />
          </motion.div>

          {/* 5. Reset button */}
          <motion.div variants={itemVariants}>
            <GoldButton
              variant="secondary"
              onClick={reset}
              className="w-full"
            >
              <RotateCcw size={16} className="mr-2" />
              {t("checkFortune")}
            </GoldButton>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* ---------- Input form view ---------- */

  return (
    <div>
      <Header title={t("title")} showBack />
      <div className="px-4 py-6">
        <p className="text-center text-sm text-gold-500 mb-6">
          {t("subtitle")}
        </p>
        {error && (
          <ErrorMessage error={error} onRetry={() => reset()} />
        )}
        {isLoading ? (
          <LoadingBook message={t("checkFortune")} />
        ) : (
          <SajuForm
            onSubmit={handleSubmit}
            loading={isLoading}
            submitLabel={t("checkFortune")}
          />
        )}
      </div>
    </div>
  );
}
