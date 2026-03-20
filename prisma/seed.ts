import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const READING_TYPES = [
  // --- 기본 ---
  { code: "daily_fortune", name: "일일 운세", description: "오늘의 상세 운세", price: 1900, endpoint: "daily_fortune" },
  { code: "monthly_fortune", name: "월간 운세", description: "이번 달 상세 운세", price: 3900, endpoint: "monthly_fortune" },
  { code: "saju_reading", name: "종합 사주 감정", description: "사주팔자 종합 분석", price: 3900, endpoint: "saju_reading" },
  { code: "sinsal", name: "신살 분석", description: "신살 상세 분석", price: 3900, endpoint: "sinsal" },
  { code: "compatibility", name: "궁합 분석", description: "두 사람의 궁합 분석", price: 4900, endpoint: "compatibility" },
  { code: "yearly_fortune", name: "연간 운세", description: "올해의 종합 운세", price: 9900, endpoint: "yearly_fortune" },
  { code: "love_reading", name: "연애운", description: "연애운 상세 분석", price: 3900, endpoint: "saju_reading" },
  { code: "friendship_reading", name: "우정운", description: "우정운 상세 분석", price: 3900, endpoint: "saju_reading" },
  { code: "marriage_reading", name: "결혼운", description: "결혼운 상세 분석", price: 3900, endpoint: "saju_reading" },
  { code: "celebrity_compatibility", name: "연예인 궁합", description: "연예인과의 궁합 분석", price: 3900, endpoint: "compatibility" },

  // --- 커리어 ---
  { code: "career_transition", name: "이직/전직 운세", description: "이직 및 전직 타이밍 분석", price: 3900, endpoint: "career_transition" },
  { code: "career_stay_or_go", name: "남을까 떠날까", description: "현 직장 잔류 vs 이직 분석", price: 3900, endpoint: "career_stay_or_go" },
  { code: "career_startup", name: "창업 적성 분석", description: "창업 적성 및 타이밍 분석", price: 3900, endpoint: "career_startup" },
  { code: "career_burnout", name: "번아웃 회복 가이드", description: "번아웃 회복 방향 분석", price: 3900, endpoint: "career_burnout" },

  // --- 결혼 ---
  { code: "marriage_timing", name: "결혼 최적 시기", description: "결혼 최적 시기 분석", price: 4900, endpoint: "marriage_timing" },
  { code: "marriage_life_forecast", name: "결혼 생활 전망", description: "결혼 후 생활 궁합 분석", price: 4900, endpoint: "marriage_life_forecast" },
  { code: "marriage_finance", name: "부부 재물운", description: "부부의 재물운 분석", price: 4900, endpoint: "marriage_finance" },
  { code: "marriage_auspicious_dates", name: "결혼 길일 택일", description: "결혼 길일 추천", price: 4900, endpoint: "marriage_auspicious_dates" },

  // --- 펫 ---
  { code: "pet_reading", name: "반려동물 사주", description: "반려동물 성향 분석", price: 2900, endpoint: "pet_reading" },
  { code: "pet_compatibility", name: "반려동물 궁합", description: "주인과 반려동물 궁합 분석", price: 3900, endpoint: "pet_compatibility" },
  { code: "pet_yearly_fortune", name: "반려동물 연간 운세", description: "반려동물 연간 운세", price: 2900, endpoint: "pet_yearly_fortune" },
  { code: "pet_adoption_timing", name: "입양 최적 시기", description: "반려동물 입양 최적 시기", price: 2900, endpoint: "pet_adoption_timing" },
];

async function main() {
  for (const rt of READING_TYPES) {
    await prisma.readingType.upsert({
      where: { code: rt.code },
      update: { name: rt.name, description: rt.description, price: rt.price, endpoint: rt.endpoint },
      create: rt,
    });
  }
  console.log(`Seed completed: ${READING_TYPES.length} ReadingType records upserted`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
