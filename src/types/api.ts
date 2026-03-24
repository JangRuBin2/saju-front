// --- Common ---

export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: number | null;
  minute?: number;
  gender: "male" | "female";
  calendar_type: "solar" | "lunar";
  is_leap_month?: boolean;
  use_night_zi?: boolean;
  use_true_solar_time?: boolean;
}

export interface PillarData {
  gan: string;
  zhi: string;
  gan_kor: string;
  zhi_kor: string;
  wu_xing: string;
  na_yin: string;
  shi_shen_gan: string;
  shi_shen_zhi: string[];
  di_shi: string;
  hide_gan: string[];
}

export interface DaYun {
  start_age: number;
  start_year: number;
  gan_zhi: string;
}

export interface SajuCalculateResponse {
  solar_date: string;
  lunar_date: string;
  is_leap_month: boolean;
  year_pillar: PillarData;
  month_pillar: PillarData;
  day_pillar: PillarData;
  time_pillar: PillarData | null;
  day_master: string;
  day_master_kor: string;
  day_master_element: string;
  day_master_yin_yang: string;
  tai_yuan: string;
  tai_yuan_na_yin: string;
  ming_gong: string;
  ming_gong_na_yin: string;
  shen_gong: string;
  shen_gong_na_yin: string;
  da_yun_start_age: number;
  da_yun_list: DaYun[];
  element_counts: Record<string, number>;
  used_night_zi: boolean;
  used_true_solar_time: boolean;
  birth_time_unknown: boolean;
}

// --- Structured Interpretation ---

export interface SectionData {
  title: string;
  content: string;
}

export interface InterpretationData {
  summary: string;
  sections: SectionData[];
  disclaimer: string | null;
}

// --- Saju Reading ---

export interface SajuReadingRequest {
  birth: BirthInput;
  stream?: boolean;
  counselor_id?: string;
}

export interface SajuReadingResponse {
  calculation: SajuCalculateResponse;
  interpretation: InterpretationData;
}

// --- Fortune ---

export interface FortuneRequest {
  birth: BirthInput;
  target_year?: number;
  target_month?: number;
  target_day?: number;
}

export interface FortuneResponse {
  calculation: SajuCalculateResponse;
  interpretation: InterpretationData;
  target_date: string;
}

// --- Compatibility ---

export interface CompatibilityRequest {
  person1: BirthInput;
  person2: BirthInput;
}

export interface CompatibilityResponse {
  person1: SajuCalculateResponse;
  person2: SajuCalculateResponse;
  interpretation: InterpretationData;
}

// --- Pet ---

export interface PetBirthInput {
  name?: string;
  year: number;
  month?: number;
  day?: number;
  hour?: number;
  gender: "male" | "female";
  breed?: string;
  size?: "small" | "medium" | "large";
}

export interface PetReadingRequest {
  pet: PetBirthInput;
  language?: string;
}

export interface PetReadingResponse {
  calculation: SajuCalculateResponse;
  interpretation: InterpretationData;
  pillars_used: number;
}

export interface PetCompatibilityRequest {
  owner: BirthInput;
  pet: PetBirthInput;
  language?: string;
}

export interface PetCompatibilityResponse {
  owner: SajuCalculateResponse;
  pet: SajuCalculateResponse;
  interpretation: InterpretationData;
  pillars_used: number;
}

export interface PetYearlyFortuneRequest {
  pet: PetBirthInput;
  target_year?: number;
  language?: string;
}

export interface PetAdoptionTimingRequest {
  owner: BirthInput;
  target_year?: number;
  language?: string;
}

// --- Career ---

export interface CareerInfo {
  current_industry?: string;
  current_role?: string;
  years_at_company?: number;
  join_year?: number;
  total_experience?: number;
  concern_type?:
    | "timing"
    | "direction"
    | "promotion_vs_move"
    | "startup"
    | "burnout"
    | "salary";
  target_period?: string;
}

export interface CareerTransitionRequest {
  birth: BirthInput;
  career_info?: CareerInfo;
  language?: string;
}

export interface CareerStayOrGoRequest {
  birth: BirthInput;
  career_info?: CareerInfo;
  language?: string;
}

export interface CareerStartupRequest {
  birth: BirthInput;
  career_info?: CareerInfo;
  target_industry?: string;
  language?: string;
}

export interface CareerBurnoutRequest {
  birth: BirthInput;
  career_info?: CareerInfo;
  language?: string;
}

// --- Marriage ---

export interface RelationshipInfoInput {
  dating_start_year?: number;
  dating_years?: number;
  target_marriage_year?: number;
  concern_type?:
    | "when"
    | "readiness"
    | "compatibility"
    | "family"
    | "finance"
    | "children";
  living_together?: boolean;
}

export interface MarriageTimingRequest {
  person1: BirthInput;
  person2: BirthInput;
  relationship_info?: RelationshipInfoInput;
  language?: string;
}

export interface MarriageTimingResponse {
  person1: SajuCalculateResponse;
  person2: SajuCalculateResponse;
  interpretation: InterpretationData;
}

export interface MarriageLifeForecastRequest {
  person1: BirthInput;
  person2: BirthInput;
  marriage_year?: number;
  language?: string;
}

export interface MarriageFinanceRequest {
  person1: BirthInput;
  person2: BirthInput;
  marriage_year?: number;
  language?: string;
}

export interface MarriageAuspiciousDatesRequest {
  person1: BirthInput;
  person2: BirthInput;
  target_year?: number;
  target_months?: number[];
  language?: string;
}

// --- Error ---

export interface ApiError {
  error: string;
  message: string;
  status_code?: number;
}
