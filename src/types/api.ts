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

export interface SajuReadingRequest {
  birth: BirthInput;
  stream?: boolean;
}

export interface SajuReadingResponse {
  calculation: SajuCalculateResponse;
  interpretation: string;
}

export interface FortuneRequest {
  birth: BirthInput;
  target_year?: number;
  target_month?: number;
  target_day?: number;
}

export interface FortuneResponse {
  calculation: SajuCalculateResponse;
  interpretation: string;
  target_date: string;
}

export interface CompatibilityRequest {
  person1: BirthInput;
  person2: BirthInput;
}

export interface CompatibilityResponse {
  person1: SajuCalculateResponse;
  person2: SajuCalculateResponse;
  interpretation: string;
}

export interface ApiError {
  error: string;
  message: string;
  status_code?: number;
}
