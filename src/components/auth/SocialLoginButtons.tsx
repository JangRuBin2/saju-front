"use client";

import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";

interface SocialLoginButtonsProps {
  callbackUrl: string;
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1C4.58 1 1 3.79 1 7.21C1 9.28 2.38 11.1 4.47 12.19L3.53 15.56C3.46 15.81 3.73 16.01 3.95 15.87L7.92 13.31C8.27 13.35 8.63 13.38 9 13.38C13.42 13.38 17 10.63 17 7.21C17 3.79 13.42 1 9 1Z"
        fill="#191919"
      />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.13 9.59L5.63 1H1V17H5.87V8.41L12.37 17H17V1H12.13V9.59Z"
        fill="#ffffff"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SocialLoginButtons({ callbackUrl }: SocialLoginButtonsProps) {
  const t = useTranslations("Auth");

  return (
    <div className="flex flex-col gap-3">
      {/* Kakao Login - official style */}
      <button
        onClick={() => signIn("kakao", { callbackUrl })}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: "#FEE500", color: "#191919" }}
      >
        <KakaoIcon />
        {t("kakaoLogin")}
      </button>

      {/* Naver Login - official style */}
      <button
        onClick={() => signIn("naver", { callbackUrl })}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: "#03C75A", color: "#ffffff" }}
      >
        <NaverIcon />
        {t("naverLogin")}
      </button>

      {/* Google Login - official style */}
      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:scale-[0.98]"
      >
        <GoogleIcon />
        {t("googleLogin")}
      </button>
    </div>
  );
}
