"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { GoldCard } from "@/components/ui/GoldCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { GoldInput } from "@/components/ui/GoldInput";
import { GoldSelect } from "@/components/ui/GoldSelect";
import { getProfile, saveProfile } from "@/lib/server/profile-actions";

export default function ProfilePage() {
  const t = useTranslations("SajuForm");
  const tCommon = useTranslations("Common");
  const tMyPage = useTranslations("MyPage");

  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [gender, setGender] = useState("");
  const [calendarType, setCalendarType] = useState("solar");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile().then((result) => {
      if (result.success && result.data) {
        const d = result.data;
        if (d.birthYear) setBirthYear(String(d.birthYear));
        if (d.birthMonth) setBirthMonth(String(d.birthMonth));
        if (d.birthDay) setBirthDay(String(d.birthDay));
        if (d.birthHour !== null) setBirthHour(String(d.birthHour));
        if (d.gender) setGender(d.gender);
        if (d.calendarType) setCalendarType(d.calendarType);
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await saveProfile({
      birthYear: birthYear ? Number(birthYear) : null,
      birthMonth: birthMonth ? Number(birthMonth) : null,
      birthDay: birthDay ? Number(birthDay) : null,
      birthHour: birthHour ? Number(birthHour) : null,
      birthMinute: null,
      gender: gender || null,
      calendarType,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}${t("birthMonth")}`,
  }));

  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}${t("birthDay")}`,
  }));

  return (
    <div>
      <Header title={tMyPage("profile")} showBack />
      <div className="px-4 py-6">
        <GoldCard>
          <div className="flex flex-col gap-4 p-2">
            <GoldInput
              label={t("birthYear")}
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="1990"
            />
            <div className="grid grid-cols-2 gap-3">
              <GoldSelect
                label={t("birthMonth")}
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                options={[{ value: "", label: t("birthMonth") }, ...monthOptions]}
              />
              <GoldSelect
                label={t("birthDay")}
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                options={[{ value: "", label: t("birthDay") }, ...dayOptions]}
              />
            </div>
            <GoldSelect
              label={t("birthTime")}
              value={birthHour}
              onChange={(e) => setBirthHour(e.target.value)}
              options={[
                { value: "", label: t("timeUnknown") },
                ...Array.from({ length: 24 }, (_, i) => ({
                  value: String(i),
                  label: `${i}:00`,
                })),
              ]}
            />
            <GoldSelect
              label={t("gender")}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              options={[
                { value: "", label: t("gender") },
                { value: "male", label: t("genderMale") },
                { value: "female", label: t("genderFemale") },
              ]}
            />
            <GoldSelect
              label={t("calendarType")}
              value={calendarType}
              onChange={(e) => setCalendarType(e.target.value)}
              options={[
                { value: "solar", label: t("solar") },
                { value: "lunar", label: t("lunar") },
              ]}
            />
            <GoldButton onClick={handleSave} disabled={saving} className="w-full">
              {saved ? tCommon("save") + " !" : saving ? "..." : tCommon("save")}
            </GoldButton>
          </div>
        </GoldCard>
      </div>
    </div>
  );
}
