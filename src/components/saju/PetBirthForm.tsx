"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { GoldButton } from "@/components/ui/GoldButton";
import { GoldInput } from "@/components/ui/GoldInput";
import { GoldSelect } from "@/components/ui/GoldSelect";
import { GoldToggle } from "@/components/ui/GoldToggle";
import { GoldCard } from "@/components/ui/GoldCard";
import { MONTHS, DAYS } from "@/lib/constants";
import type { PetBirthInput } from "@/types/api";

interface PetBirthFormProps {
  onSubmit: (data: PetBirthInput) => void;
  loading?: boolean;
  submitLabel?: string;
}

export function PetBirthForm({ onSubmit, loading, submitLabel }: PetBirthFormProps) {
  const t = useTranslations("Pet");
  const tForm = useTranslations("SajuForm");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [gender, setGender] = useState("");
  const [breed, setBreed] = useState("");
  const [size, setSize] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !gender) return;

    const data: PetBirthInput = {
      year: Number(year),
      gender: gender as "male" | "female",
      ...(name ? { name } : {}),
      ...(month ? { month: Number(month) } : {}),
      ...(day ? { day: Number(day) } : {}),
      ...(breed ? { breed } : {}),
      ...(size ? { size: size as "small" | "medium" | "large" } : {}),
    };
    onSubmit(data);
  };

  return (
    <GoldCard variant="highlight" className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-gold-300 text-center">
          {t("petInfoTitle")}
        </h2>

        <GoldInput
          label={t("petName")}
          placeholder={t("petNamePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-3">
          <GoldInput
            label={tForm("birthYear")}
            type="number"
            placeholder="2020"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min={1990}
            max={new Date().getFullYear()}
          />
          <GoldSelect
            label={tForm("birthMonth")}
            options={MONTHS}
            placeholder="--"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <GoldSelect
            label={tForm("birthDay")}
            options={DAYS}
            placeholder="--"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gold-400 font-medium">
            {tForm("gender")}
          </label>
          <GoldToggle
            options={[
              { value: "male", label: tForm("genderMale") },
              { value: "female", label: tForm("genderFemale") },
            ]}
            value={gender}
            onChange={setGender}
            className="w-full justify-center"
          />
        </div>

        <GoldInput
          label={t("petBreed")}
          placeholder={t("petBreedPlaceholder")}
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />

        <GoldSelect
          label={t("petSize")}
          options={[
            { value: "small", label: t("petSizeSmall") },
            { value: "medium", label: t("petSizeMedium") },
            { value: "large", label: t("petSizeLarge") },
          ]}
          placeholder="--"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />

        <GoldButton type="submit" size="lg" loading={loading} className="w-full mt-2">
          {submitLabel || t("analyze")}
        </GoldButton>
      </form>
    </GoldCard>
  );
}
