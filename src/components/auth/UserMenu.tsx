"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { User, LogOut, CreditCard, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function UserMenu() {
  const { data: session } = useSession();
  const t = useTranslations("Auth");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  const displayName =
    session.user.name || session.user.email?.split("@")[0] || "User";

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-lg border border-gold-700/50 bg-midnight-800/80 px-3 py-1.5 text-xs text-gold-400 transition-colors hover:border-gold-500/50 hover:text-gold-300"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt=""
            className="h-5 w-5 rounded-full"
          />
        ) : (
          <User size={14} strokeWidth={1.5} />
        )}
        <span className="max-w-[80px] truncate">{displayName}</span>
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border border-gold-700/50 bg-midnight-900 shadow-lg">
          <Link
            href="/mypage"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-xs text-gold-400 transition-colors hover:bg-midnight-800"
          >
            <User size={14} />
            {t("mypage")}
          </Link>
          <Link
            href="/payment"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-xs text-gold-400 transition-colors hover:bg-midnight-800"
          >
            <CreditCard size={14} />
            {t("payment")}
          </Link>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-2 border-t border-gold-800/30 px-3 py-2.5 text-xs text-gold-600 transition-colors hover:bg-midnight-800 hover:text-gold-400"
          >
            <LogOut size={14} />
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
