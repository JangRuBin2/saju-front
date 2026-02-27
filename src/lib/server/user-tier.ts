import { prisma } from "./prisma";

export async function getUserTier(
  userId: string
): Promise<"free" | "premium"> {
  const activePayment = await prisma.payment.findFirst({
    where: {
      userId,
      status: "paid",
      endDate: { gte: new Date() },
    },
    orderBy: { endDate: "desc" },
  });

  return activePayment ? "premium" : "free";
}
