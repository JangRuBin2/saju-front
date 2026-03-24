"use client";

import { useState } from "react";
import Image from "next/image";
import type { Counselor } from "@/types/counselor";

interface CounselorAvatarProps {
  counselor: Counselor;
  size?: number;
  showAiBadge?: boolean;
  className?: string;
}

export function CounselorAvatar({
  counselor,
  size = 80,
  showAiBadge = true,
  className = "",
}: CounselorAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const hasImage = counselor.imagePath && !imgError;

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {hasImage ? (
        <Image
          src={counselor.imagePath!}
          alt={counselor.id}
          width={size}
          height={size}
          className="rounded-full object-cover border-2 border-gold-500/40"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center border-2 border-gold-500/40"
          style={{
            width: size,
            height: size,
            backgroundColor: `${counselor.accentColor}20`,
          }}
        >
          <span
            className="font-bold"
            style={{
              fontSize: size * 0.35,
              color: counselor.accentColor,
            }}
          >
            {counselor.initial}
          </span>
        </div>
      )}
      {showAiBadge && (
        <span className="absolute bottom-0 right-0 bg-midnight-900/80 text-[9px] text-gold-400/70 px-1 rounded leading-tight border border-gold-600/20">
          AI
        </span>
      )}
    </div>
  );
}
