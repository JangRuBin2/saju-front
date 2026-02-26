export const EARTHLY_BRANCH_HOURS: Record<string, { start: number; end: number; label: string }> = {
  "자(子)": { start: 23, end: 1, label: "23:00 - 01:00" },
  "축(丑)": { start: 1, end: 3, label: "01:00 - 03:00" },
  "인(寅)": { start: 3, end: 5, label: "03:00 - 05:00" },
  "묘(卯)": { start: 5, end: 7, label: "05:00 - 07:00" },
  "진(辰)": { start: 7, end: 9, label: "07:00 - 09:00" },
  "사(巳)": { start: 9, end: 11, label: "09:00 - 11:00" },
  "오(午)": { start: 11, end: 13, label: "11:00 - 13:00" },
  "미(未)": { start: 13, end: 15, label: "13:00 - 15:00" },
  "신(申)": { start: 15, end: 17, label: "15:00 - 17:00" },
  "유(酉)": { start: 17, end: 19, label: "17:00 - 19:00" },
  "술(戌)": { start: 19, end: 21, label: "19:00 - 21:00" },
  "해(亥)": { start: 21, end: 23, label: "21:00 - 23:00" },
};

export const BIRTH_HOURS = [
  { value: -1, label: "모름" },
  { value: 0, label: "자시 (23:00-01:00)" },
  { value: 2, label: "축시 (01:00-03:00)" },
  { value: 4, label: "인시 (03:00-05:00)" },
  { value: 6, label: "묘시 (05:00-07:00)" },
  { value: 8, label: "진시 (07:00-09:00)" },
  { value: 10, label: "사시 (09:00-11:00)" },
  { value: 12, label: "오시 (11:00-13:00)" },
  { value: 14, label: "미시 (13:00-15:00)" },
  { value: 16, label: "신시 (15:00-17:00)" },
  { value: 18, label: "유시 (17:00-19:00)" },
  { value: 20, label: "술시 (19:00-21:00)" },
  { value: 22, label: "해시 (21:00-23:00)" },
];

export const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}월`,
}));

export const DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}일`,
}));
