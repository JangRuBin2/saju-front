"use client";

import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldFrame } from "@/components/decorative/GoldFrame";
import { GoldButton } from "@/components/ui/GoldButton";

export default function LoginPage() {
  const t = useTranslations("Auth");

  return (
    <div>
      <Header title={t("login")} showBack />
      <div className="flex flex-col items-center gap-8 px-4 pt-12">
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
          <div className="flex flex-col gap-3 p-2">
            <GoldButton
              onClick={() => signIn("kakao", { callbackUrl: "/" })}
              className="w-full"
              style={{ backgroundColor: "#FEE500", color: "#191919" }}
            >
              {t("kakaoLogin")}
            </GoldButton>

            <GoldButton
              onClick={() => signIn("naver", { callbackUrl: "/" })}
              className="w-full"
              style={{ backgroundColor: "#03C75A", color: "#ffffff" }}
            >
              {t("naverLogin")}
            </GoldButton>

            <GoldButton
              onClick={() => signIn("google", { callbackUrl: "/" })}
              variant="secondary"
              className="w-full"
            >
              {t("googleLogin")}
            </GoldButton>
          </div>
        </GoldCard>

        <p className="text-xs text-gold-700 text-center max-w-xs">
          {t("termsNotice")}
        </p>
      </div>
    </div>
  );
}
