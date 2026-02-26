"use client";

import { motion } from "framer-motion";
import { GoldCard } from "@/components/ui/GoldCard";

interface InterpretCardProps {
  text: string;
  isStreaming?: boolean;
}

export function InterpretCard({ text, isStreaming }: InterpretCardProps) {
  const paragraphs = text.split("\n").filter((p) => p.trim());

  return (
    <GoldCard variant="default" className="relative">
      <div className="prose prose-invert prose-gold max-w-none">
        {paragraphs.map((paragraph, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-sm leading-relaxed text-gold-100/80 mb-3 last:mb-0"
          >
            {paragraph}
          </motion.p>
        ))}
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-gold-400 animate-pulse ml-0.5" />
        )}
      </div>
    </GoldCard>
  );
}
