export type CounselorTier = "free" | "basic" | "premium";

export interface Counselor {
  id: string;
  nameKey: string;
  titleKey: string;
  descriptionKey: string;
  imagePath: string | null;
  tier: CounselorTier;
  initial: string;
  accentColor: string;
  systemPrompt: string;
}
