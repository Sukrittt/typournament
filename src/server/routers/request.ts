import { and, desc, eq } from "drizzle-orm";

import { db } from "~/db";
import { request, tournament, users } from "~/db/schema";
import { createTRPCRouter, privateProcedure } from "~/server/trpc";

export const requestRouter = createTRPCRouter({
  getUserRequests: privateProcedure.query(async ({ ctx }) => {
    const userRequests = await db
      .select()
      .from(request)
      .where(
        and(eq(request.receiverId, ctx.userId), eq(request.accepted, false))
      )
      .innerJoin(tournament, eq(tournament.id, request.tournamentId))
      .innerJoin(users, eq(request.senderId, users.id))
      .orderBy(desc(request.createdAt));

    const formattedRequests = {
      tournament: userRequests.length > 0 ? userRequests[0].tournament : null,
      requests: userRequests.map((request) => ({
        request: { ...request.request },
        sender: { ...request.user },
      })),
    };

    return formattedRequests;
  }),
});
