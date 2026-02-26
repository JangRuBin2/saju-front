"use client";

import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, Share2 } from "lucide-react";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showShare?: boolean;
  onShare?: () => void;
}

export function Header({
  title,
  showBack = false,
  showShare = false,
  onShare,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 border-b border-gold-600/10 bg-midnight-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center rounded-lg p-1.5 text-gold-400 hover:bg-gold-600/10 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
        </div>
        <h1 className="text-base font-semibold text-gold-300">{title}</h1>
        <div className="w-10">
          {showShare && (
            <button
              onClick={onShare}
              className="flex items-center justify-center rounded-lg p-1.5 text-gold-400 hover:bg-gold-600/10 transition-colors"
              aria-label="Share"
            >
              <Share2 size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
