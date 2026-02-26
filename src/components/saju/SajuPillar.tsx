"use client";

import { motion } from "framer-motion";
import type { PillarData } from "@/types/api";

interface SajuPillarProps {
  label: string;
  pillar: PillarData;
  index: number;
}

export function SajuPillar({ label, pillar, index }: SajuPillarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="flex flex-col items-center gap-2"
    >
      <span className="text-xs text-gold-500 font-medium">{label}</span>
      <div className="flex flex-col items-center gap-1 rounded-lg border border-gold-600/30 bg-midnight-800/60 p-3 min-w-[64px]">
        <div className="text-2xl font-serif text-gold-300">{pillar.gan}</div>
        <div className="h-px w-8 bg-gold-600/30" />
        <div className="text-2xl font-serif text-gold-400">{pillar.zhi}</div>
      </div>
      <span className="text-[10px] text-gold-600">
        {pillar.gan_kor} / {pillar.zhi_kor}
      </span>
    </motion.div>
  );
}
