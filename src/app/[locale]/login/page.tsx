"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldFrame } from "@/components/decorative/GoldFrame";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

function LoginContent() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div>
      <Header title={t("login")} showBack />
      <div className="flex flex-col items-center gap-8 px-4 pt-12">
        {error && (
          <div className="w-full max-w-sm rounded-lg border border-red-500/30 bg-red-900/20 px-4 py-3 text-center text-sm text-red-400">
            로그인 중 오류가 발생했습니다. 다시 시도해 주세요.
          </div>
        )}
        <GoldFrame size="lg">
          <span className="text-4xl font-serif text-gold-gradient">命</span>
        </GoldFrame>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gold-gradient">
            {t("loginTitle")}
          </h1>
          <p className="mt-2 text-sm text-gold-500">{t("loginSubtitle")}</p>
        </div>

        <GoldCard className="w-full max-w-sm">
          <div className="p-2">
            <SocialLoginButtons callbackUrl={callbackUrl} />
          </div>
        </GoldCard>

        <p className="text-xs text-gold-700 text-center max-w-xs">
          {t("termsNotice")}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
