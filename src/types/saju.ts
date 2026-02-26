export type OhengHanja = "木" | "火" | "土" | "金" | "水";

export interface OhengDisplay {
  key: OhengHanja;
  label: string;
  color: string;
  bgColor: string;
}

export const OHENG_LIST: OhengDisplay[] = [
  {
    key: "木",
    label: "목",
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.15)",
  },
  {
    key: "火",
    label: "화",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
  },
  {
    key: "土",
    label: "토",
    color: "#eab308",
    bgColor: "rgba(234, 179, 8, 0.15)",
  },
  {
    key: "金",
    label: "금",
    color: "#a1a1aa",
    bgColor: "rgba(161, 161, 170, 0.15)",
  },
  {
    key: "水",
    label: "수",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
  },
];

export const OHENG_MAP: Record<string, OhengDisplay> = Object.fromEntries(
  OHENG_LIST.map((item) => [item.key, item])
);
