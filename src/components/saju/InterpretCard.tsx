"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoldCard } from "@/components/ui/GoldCard";
import type { InterpretationData } from "@/types/api";

interface InterpretCardProps {
  /** Structured interpretation from API (non-streaming endpoints) */
  interpretation?: InterpretationData;
  /** Raw text fallback for SSE streaming */
  text?: string;
  isStreaming?: boolean;
}

export function InterpretCard({
  interpretation,
  text,
  isStreaming,
}: InterpretCardProps) {
  // Streaming mode: show raw text
  if (text !== undefined && !interpretation) {
    return <RawTextCard text={text} isStreaming={isStreaming} />;
  }

  // Structured mode
  if (interpretation) {
    return (
      <StructuredCard
        interpretation={interpretation}
        isStreaming={isStreaming}
      />
    );
  }

  return null;
}

// --- Raw text (streaming fallback) ---

function RawTextCard({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming?: boolean;
}) {
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

// --- Structured (non-streaming) ---

function StructuredCard({
  interpretation,
  isStreaming,
}: {
  interpretation: InterpretationData;
  isStreaming?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <GoldCard variant="default">
        <p className="text-base font-medium text-gold-100 leading-relaxed">
          {interpretation.summary}
        </p>
      </GoldCard>

      {/* Sections (Accordion) */}
      {interpretation.sections.map((section, i) => (
        <GoldCard key={i} variant="default" className="overflow-hidden">
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-sm font-semibold text-gold-300">
              {section.title}
            </h3>
            <span
              className={`text-gold-400 transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            >
              &#9662;
            </span>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-3 mt-3 border-t border-gold-800/30">
                  {section.content
                    .split("\n")
                    .filter(Boolean)
                    .map((line, j) => (
                      <p
                        key={j}
                        className="text-sm leading-relaxed text-gold-100/80 mb-2 last:mb-0"
                      >
                        {line}
                      </p>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GoldCard>
      ))}

      {/* Streaming indicator */}
      {isStreaming && (
        <div className="flex items-center gap-2 px-4">
          <span className="inline-block w-1.5 h-4 bg-gold-400 animate-pulse" />
          <span className="text-xs text-gold-400/60">해석 중...</span>
        </div>
      )}

      {/* Disclaimer */}
      {interpretation.disclaimer && (
        <p className="text-xs text-gold-100/40 px-4 leading-relaxed">
          {interpretation.disclaimer}
        </p>
      )}
    </div>
  );
}
