import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const READING_TYPES = [
  { code: "daily_fortune", name: "일일 운세", description: "오늘의 상세 운세", price: 1100, endpoint: "daily_fortune" },
  { code: "love_reading", name: "연애운", description: "연애운 상세 분석", price: 3300, endpoint: "saju_reading" },
  { code: "friendship_reading", name: "우정운", description: "우정운 상세 분석", price: 3300, endpoint: "saju_reading" },
  { code: "marriage_reading", name: "결혼운", description: "결혼운 상세 분석", price: 3300, endpoint: "saju_reading" },
  { code: "monthly_fortune", name: "월간 운세", description: "이번 달 상세 운세", price: 3300, endpoint: "monthly_fortune" },
  { code: "celebrity_compatibility", name: "연예인 궁합", description: "연예인과의 궁합 분석", price: 3300, endpoint: "compatibility" },
  { code: "saju_reading", name: "종합 사주 감정", description: "사주팔자 종합 분석", price: 5500, endpoint: "saju_reading" },
  { code: "sinsal", name: "신살 분석", description: "신살 상세 분석", price: 5500, endpoint: "sinsal" },
  { code: "compatibility", name: "궁합 분석", description: "두 사람의 궁합 분석", price: 5500, endpoint: "compatibility" },
  { code: "yearly_fortune", name: "연간 운세", description: "올해의 종합 운세", price: 5500, endpoint: "yearly_fortune" },
];

async function main() {
  for (const rt of READING_TYPES) {
    await prisma.readingType.upsert({
      where: { code: rt.code },
      update: { name: rt.name, description: rt.description, price: rt.price, endpoint: rt.endpoint },
      create: rt,
    });
  }
  console.log("Seed completed: ReadingType data inserted");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
