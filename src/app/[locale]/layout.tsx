import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { StarField } from "@/components/decorative/StarField";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "사주명리 - Saju Myeongri",
    template: "%s | 사주명리",
  },
  description: "사주팔자, 오늘의 운세, 궁합 분석 - 동양 철학의 지혜로 당신의 운명을 밝혀드립니다. Four Pillars of Destiny analysis powered by Eastern philosophy.",
  keywords: ["사주", "사주팔자", "운세", "궁합", "오늘의운세", "사주명리", "fortune", "saju", "compatibility"],
  authors: [{ name: "Saju Myeongri" }],
  openGraph: {
    title: "사주명리 - Saju Myeongri",
    description: "동양 철학의 지혜로 당신의 운명을 밝혀드립니다",
    type: "website",
    locale: "ko_KR",
    siteName: "사주명리",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className="dark">
      <body className="noise-overlay">
        <SessionProvider>
          <NextIntlClientProvider>
            <StarField count={40} />
            <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
              <AuthHeader />
              <LocaleSwitcher />
            </div>
            <main className="mx-auto min-h-screen max-w-lg pb-20">
              {children}
            </main>
            <BottomNav />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
