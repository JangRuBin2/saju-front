"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { SajuForm } from "@/components/saju/SajuForm";
import type { BirthInput } from "@/types/api";

export default function SajuInputPage() {
  const t = useTranslations("SajuForm");
  const router = useRouter();

  const handleSubmit = (birthInput: BirthInput) => {
    sessionStorage.setItem("sajuBirthInput", JSON.stringify(birthInput));
    router.push("/saju/result");
  };

  return (
    <div>
      <Header title={t("title")} showBack />
      <div className="px-4 py-6">
        <SajuForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
