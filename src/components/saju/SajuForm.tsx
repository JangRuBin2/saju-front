"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { GoldButton } from "@/components/ui/GoldButton";
import { GoldInput } from "@/components/ui/GoldInput";
import { GoldSelect } from "@/components/ui/GoldSelect";
import { GoldToggle } from "@/components/ui/GoldToggle";
import { GoldCard } from "@/components/ui/GoldCard";
import { BIRTH_HOURS, MONTHS, DAYS } from "@/lib/constants";
import { CounselorPicker } from "@/components/counselor/CounselorPicker";
import type { BirthInput } from "@/types/api";

interface SajuFormProps {
  onSubmit: (data: BirthInput, counselorId?: string) => void;
  loading?: boolean;
  submitLabel?: string;
  showCounselorPicker?: boolean;
}

interface FormErrors {
  year?: string;
  month?: string;
  day?: string;
  gender?: string;
}

export function SajuForm({ onSubmit, loading, submitLabel, showCounselorPicker = true }: SajuFormProps) {
  const t = useTranslations("SajuForm");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("-1");
  const [gender, setGender] = useState("");
  const [calendarType, setCalendarType] = useState("solar");
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedCounselorId, setSelectedCounselorId] = useState<string | null>("master-yoon");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();

    if (!year || isNaN(yearNum)) {
      newErrors.year = t("validation.yearRequired");
    } else if (yearNum < 1900 || yearNum > currentYear) {
      newErrors.year = t("validation.yearRange");
    }
    if (!month) {
      newErrors.month = t("validation.monthRequired");
    }
    if (!day) {
      newErrors.day = t("validation.dayRequired");
    } else if (month) {
      const monthNum = Number(month);
      const dayNum = Number(day);
      const maxDay = new Date(yearNum || 2000, monthNum, 0).getDate();
      if (dayNum > maxDay) {
        newErrors.day = t("validation.dayInvalid");
      }
    }
    if (!gender) {
      newErrors.gender = t("validation.genderRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const hourValue = Number(hour);
    const data: BirthInput = {
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: hourValue === -1 ? null : hourValue,
      minute: 0,
      gender: gender as "male" | "female",
      calendar_type: calendarType as "solar" | "lunar",
    };

    onSubmit(data, selectedCounselorId ?? undefined);
  };

  return (
    <GoldCard variant="highlight" className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-gold-300 text-center">
          {t("title")}
        </h2>

        {/* Counselor picker */}
        {showCounselorPicker && (
          <CounselorPicker
            selectedId={selectedCounselorId}
            onSelect={setSelectedCounselorId}
          />
        )}

        {/* Calendar type */}
        <div className="flex justify-center">
          <GoldToggle
            options={[
              { value: "solar", label: t("solar") },
              { value: "lunar", label: t("lunar") },
            ]}
            value={calendarType}
            onChange={setCalendarType}
          />
        </div>

        {/* Birth date */}
        <div className="grid grid-cols-3 gap-3">
          <GoldInput
            label={t("birthYear")}
            type="number"
            placeholder="1990"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            error={errors.year}
            min={1900}
            max={new Date().getFullYear()}
          />
          <GoldSelect
            label={t("birthMonth")}
            options={MONTHS}
            placeholder="--"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            error={errors.month}
          />
          <GoldSelect
            label={t("birthDay")}
            options={DAYS}
            placeholder="--"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            error={errors.day}
          />
        </div>

        {/* Birth time */}
        <GoldSelect
          label={t("birthTime")}
          options={BIRTH_HOURS.map((h) => ({
            value: h.value,
            label: h.label,
          }))}
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        />

        {/* Gender */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gold-400 font-medium">
            {t("gender")}
          </label>
          <GoldToggle
            options={[
              { value: "male", label: t("genderMale") },
              { value: "female", label: t("genderFemale") },
            ]}
            value={gender}
            onChange={setGender}
            className="w-full justify-center"
          />
          {errors.gender && (
            <p className="text-xs text-red-400">{errors.gender}</p>
          )}
        </div>

        <GoldButton type="submit" size="lg" loading={loading} className="w-full mt-2">
          {submitLabel || t("analyze")}
        </GoldButton>
      </form>
    </GoldCard>
  );
}
