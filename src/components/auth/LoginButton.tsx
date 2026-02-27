"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogIn } from "lucide-react";

export function LoginButton() {
  const t = useTranslations("Auth");

  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 rounded-lg border border-gold-700/50 bg-midnight-800/80 px-3 py-1.5 text-xs text-gold-400 transition-colors hover:border-gold-500/50 hover:text-gold-300"
    >
      <LogIn size={14} strokeWidth={1.5} />
      <span>{t("login")}</span>
    </Link>
  );
}
