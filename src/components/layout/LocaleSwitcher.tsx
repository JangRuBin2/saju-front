"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("LocaleSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as "ko" | "en" | "ja" | "zh" });
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gold-400 hover:bg-gold-600/10 transition-colors"
        aria-label="Switch language"
      >
        <Globe size={16} />
        <span className="uppercase text-xs font-medium">{locale}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 min-w-[140px] rounded-lg border border-gold-600/30 bg-midnight-800/95 py-1 shadow-lg backdrop-blur-md z-50">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                loc === locale
                  ? "bg-gold-600/20 text-gold-300"
                  : "text-gold-500 hover:bg-gold-600/10 hover:text-gold-300"
              }`}
            >
              {t(loc as "ko" | "en" | "ja" | "zh")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
