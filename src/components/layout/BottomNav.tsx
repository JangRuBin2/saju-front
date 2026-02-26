"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, Compass, Sun, Heart, User } from "lucide-react";

const NAV_ITEMS = [
  { key: "home", href: "/", icon: Home },
  { key: "saju", href: "/saju", icon: Compass },
  { key: "today", href: "/today", icon: Sun },
  { key: "compatibility", href: "/compatibility", icon: Heart },
  { key: "mypage", href: "/mypage", icon: User },
] as const;

export function BottomNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gold-600/20 bg-midnight-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={key}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                active ? "text-gold-400" : "text-gold-700 hover:text-gold-500"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">
                {t(key)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
