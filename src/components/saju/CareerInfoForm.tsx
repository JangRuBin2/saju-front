"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { GoldInput } from "@/components/ui/GoldInput";
import { GoldSelect } from "@/components/ui/GoldSelect";
import type { CareerInfo } from "@/types/api";

interface CareerInfoFormProps {
  onChange: (info: CareerInfo) => void;
}

export function CareerInfoForm({ onChange }: CareerInfoFormProps) {
  const t = useTranslations("Career");
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");

  const update = (patch: Partial<CareerInfo>) => {
    const info: CareerInfo = {
      ...(industry ? { current_industry: industry } : {}),
      ...(role ? { current_role: role } : {}),
      ...(experience ? { total_experience: Number(experience) } : {}),
      ...patch,
    };
    onChange(info);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gold-400 font-medium">{t("careerInfoTitle")}</p>
      <GoldInput
        label={t("industry")}
        placeholder={t("industryPlaceholder")}
        value={industry}
        onChange={(e) => {
          setIndustry(e.target.value);
          update({ current_industry: e.target.value });
        }}
      />
      <GoldInput
        label={t("role")}
        placeholder={t("rolePlaceholder")}
        value={role}
        onChange={(e) => {
          setRole(e.target.value);
          update({ current_role: e.target.value });
        }}
      />
      <GoldSelect
        label={t("experience")}
        options={[
          { value: "1", label: t("expUnder1") },
          { value: "3", label: t("exp1to3") },
          { value: "5", label: t("exp3to5") },
          { value: "10", label: t("exp5to10") },
          { value: "15", label: t("exp10plus") },
        ]}
        placeholder="--"
        value={experience}
        onChange={(e) => {
          setExperience(e.target.value);
          update({ total_experience: Number(e.target.value) });
        }}
      />
    </div>
  );
}
