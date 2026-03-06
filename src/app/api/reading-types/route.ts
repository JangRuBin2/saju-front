import { prisma } from "@/lib/server/prisma";

export async function GET() {
  const types = await prisma.readingType.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
  return Response.json(types);
}
