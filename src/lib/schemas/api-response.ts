import { z } from "zod";

// --- Common ---

export const PillarDataSchema = z.object({
  gan: z.string(),
  zhi: z.string(),
  gan_kor: z.string(),
  zhi_kor: z.string(),
  wu_xing: z.string(),
  na_yin: z.string(),
  shi_shen_gan: z.string(),
  shi_shen_zhi: z.array(z.string()),
  di_shi: z.string(),
  hide_gan: z.array(z.string()),
});

export const DaYunSchema = z.object({
  start_age: z.number(),
  start_year: z.number(),
  gan_zhi: z.string(),
});

export const SajuCalculateResponseSchema = z.object({
  solar_date: z.string(),
  lunar_date: z.string(),
  is_leap_month: z.boolean(),
  year_pillar: PillarDataSchema,
  month_pillar: PillarDataSchema,
  day_pillar: PillarDataSchema,
  time_pillar: PillarDataSchema.nullable(),
  day_master: z.string(),
  day_master_kor: z.string(),
  day_master_element: z.string(),
  day_master_yin_yang: z.string(),
  tai_yuan: z.string(),
  tai_yuan_na_yin: z.string(),
  ming_gong: z.string(),
  ming_gong_na_yin: z.string(),
  shen_gong: z.string(),
  shen_gong_na_yin: z.string(),
  da_yun_start_age: z.number(),
  da_yun_list: z.array(DaYunSchema),
  element_counts: z.record(z.string(), z.number()),
  used_night_zi: z.boolean(),
  used_true_solar_time: z.boolean(),
  birth_time_unknown: z.boolean(),
});

// --- Structured Interpretation ---

export const SectionDataSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const InterpretationDataSchema = z.object({
  summary: z.string(),
  sections: z.array(SectionDataSchema),
  disclaimer: z.string().nullable(),
});

// --- Saju Reading ---

export const SajuReadingResponseSchema = z.object({
  calculation: SajuCalculateResponseSchema,
  interpretation: InterpretationDataSchema,
});

// --- Fortune ---

export const FortuneResponseSchema = z.object({
  calculation: SajuCalculateResponseSchema,
  interpretation: InterpretationDataSchema,
  target_date: z.string(),
});

// --- Compatibility ---

export const CompatibilityResponseSchema = z.object({
  person1: SajuCalculateResponseSchema,
  person2: SajuCalculateResponseSchema,
  interpretation: InterpretationDataSchema,
});

// --- Pet ---

export const PetReadingResponseSchema = z.object({
  calculation: SajuCalculateResponseSchema,
  interpretation: InterpretationDataSchema,
  pillars_used: z.number(),
});

export const PetCompatibilityResponseSchema = z.object({
  owner: SajuCalculateResponseSchema,
  pet: SajuCalculateResponseSchema,
  interpretation: InterpretationDataSchema,
  pillars_used: z.number(),
});

// --- Marriage ---

export const MarriageTimingResponseSchema = z.object({
  person1: SajuCalculateResponseSchema,
  person2: SajuCalculateResponseSchema,
  interpretation: InterpretationDataSchema,
});
