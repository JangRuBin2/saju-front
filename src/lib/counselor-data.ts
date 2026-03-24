import type { Counselor } from "@/types/counselor";

export const COUNSELORS: Counselor[] = [
  {
    id: "master-yoon",
    nameKey: "masterYoon.name",
    titleKey: "masterYoon.title",
    descriptionKey: "masterYoon.description",
    imagePath: "/images/counselors/master-yoon.webp",
    tier: "free",
    initial: "윤",
    accentColor: "#c9a44a",
  },
  {
    id: "soyeon",
    nameKey: "soyeon.name",
    titleKey: "soyeon.title",
    descriptionKey: "soyeon.description",
    imagePath: "/images/counselors/soyeon.webp",
    tier: "basic",
    initial: "김",
    accentColor: "#a3c4f3",
  },
  {
    id: "grandma-moon",
    nameKey: "grandmaMoon.name",
    titleKey: "grandmaMoon.title",
    descriptionKey: "grandmaMoon.description",
    imagePath: "/images/counselors/grandma-moon.webp",
    tier: "premium",
    initial: "문",
    accentColor: "#f4a9b8",
  },
];

export function getCounselorById(id: string): Counselor | undefined {
  return COUNSELORS.find((c) => c.id === id);
}
