import { auth } from "@/lib/auth";
import { findUnusedPayment } from "@/lib/server/payment-service";
import { getUserUnusedTickets } from "@/lib/server/payment-service";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const typeCode = url.searchParams.get("type");

  if (typeCode) {
    const ticket = await findUnusedPayment(session.user.id, typeCode);
    return Response.json({ hasTicket: !!ticket, ticket });
  }

  const tickets = await getUserUnusedTickets(session.user.id);
  return Response.json({ tickets });
}
