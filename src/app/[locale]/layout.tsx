import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { BottomNav } from "@/components/layout/BottomNav";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { StarField } from "@/components/decorative/StarField";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Saju Myeongri",
  description: "Eastern philosophy wisdom for your destiny",
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
        <NextIntlClientProvider>
          <StarField count={40} />
          <div className="fixed top-3 right-3 z-50">
            <LocaleSwitcher />
          </div>
          <main className="mx-auto min-h-screen max-w-lg pb-20">
            {children}
          </main>
          <BottomNav />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
