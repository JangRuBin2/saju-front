"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CounselorAvatar } from "./CounselorAvatar";
import { GoldCard } from "@/components/ui/GoldCard";
import type { Counselor } from "@/types/counselor";
import type { InterpretationData } from "@/types/api";

interface ChatStyleResultProps {
  counselor: Counselor;
  interpretation?: InterpretationData;
  text?: string;
  isStreaming?: boolean;
}

export function ChatStyleResult({
  counselor,
  interpretation,
  text,
  isStreaming,
}: ChatStyleResultProps) {
  const t = useTranslations("Counselor");

  return (
    <div className="space-y-4">
      {/* Counselor profile header */}
      <div className="flex items-center gap-3 px-1">
        <CounselorAvatar counselor={counselor} size={48} />
        <div>
          <p className="text-sm font-semibold text-gold-200">
            {t(counselor.nameKey)}
            <span className="ml-1.5 text-[10px] font-normal text-gold-400/50 border border-gold-600/20 rounded px-1 py-0.5">
              {t("aiCharacterTag")}
            </span>
          </p>
          <p className="text-xs text-gold-100/50">{t(counselor.titleKey)}</p>
        </div>
      </div>

      {/* Chat bubbles */}
      {text !== undefined && !interpretation ? (
        <StreamingBubble counselor={counselor} text={text} isStreaming={isStreaming} />
      ) : interpretation ? (
        <StructuredBubbles counselor={counselor} interpretation={interpretation} isStreaming={isStreaming} />
      ) : null}

      {/* AI Disclaimer */}
      <p className="text-[10px] text-gold-100/30 px-2 leading-relaxed">
        {t("disclaimer")}
      </p>
    </div>
  );
}

function ChatBubble({
  children,
  accentColor,
  delay = 0,
}: {
  children: React.ReactNode;
  accentColor: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="ml-6"
    >
      <div
        className="relative rounded-xl rounded-tl-sm p-4 border border-gold-600/15 bg-midnight-800/50"
        style={{ boxShadow: `0 0 8px ${accentColor}08` }}
      >
        <div
          className="absolute left-0 top-3 w-0.5 h-4 rounded-full"
          style={{ backgroundColor: `${accentColor}60` }}
        />
        {children}
      </div>
    </motion.div>
  );
}

function StreamingBubble({
  counselor,
  text,
  isStreaming,
}: {
  counselor: Counselor;
  text: string;
  isStreaming?: boolean;
}) {
  const paragraphs = text.split("\n").filter((p) => p.trim());

  return (
    <ChatBubble accentColor={counselor.accentColor}>
      <div className="prose prose-invert prose-gold max-w-none">
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="text-sm leading-relaxed text-gold-100/80 mb-2 last:mb-0"
          >
            {paragraph}
          </p>
        ))}
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-gold-400 animate-pulse ml-0.5" />
        )}
      </div>
    </ChatBubble>
  );
}

function StructuredBubbles({
  counselor,
  interpretation,
  isStreaming,
}: {
  counselor: Counselor;
  interpretation: InterpretationData;
  isStreaming?: boolean;
}) {
  return (
    <div className="space-y-3">
      {/* Summary bubble */}
      <ChatBubble accentColor={counselor.accentColor}>
        <p className="text-sm font-medium text-gold-100 leading-relaxed">
          {interpretation.summary}
        </p>
      </ChatBubble>

      {/* Section bubbles */}
      {interpretation.sections.map((section, i) => (
        <ChatBubble key={i} accentColor={counselor.accentColor} delay={i * 0.1}>
          <h4 className="text-xs font-semibold text-gold-300 mb-2">
            {section.title}
          </h4>
          {section.content
            .split("\n")
            .filter(Boolean)
            .map((line, j) => (
              <p
                key={j}
                className="text-sm leading-relaxed text-gold-100/80 mb-1.5 last:mb-0"
              >
                {line}
              </p>
            ))}
        </ChatBubble>
      ))}

      {isStreaming && (
        <div className="flex items-center gap-2 ml-6 px-4">
          <span className="inline-block w-1.5 h-4 bg-gold-400 animate-pulse" />
          <span className="text-xs text-gold-400/60">...</span>
        </div>
      )}
    </div>
  );
}
