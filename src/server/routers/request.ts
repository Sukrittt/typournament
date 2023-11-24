import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";

import { db } from "~/db";
import { participation, request, tournament, users } from "~/db/schema";
import { createTRPCRouter, privateProcedure } from "~/server/trpc";
import { TRPCError } from "@trpc/server";

export const requestRouter = createTRPCRouter({
  getUserRequests: privateProcedure.query(async ({ ctx }) => {
    const userRequests = await db
      .select()
      .from(request)
      .where(
        and(eq(request.receiverId, ctx.userId), eq(request.status, "pending"))
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
  handleRequest: privateProcedure
    .input(
      z.object({
        requestId: z.number(),
        status: z.enum(["accept", "reject"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingRequests = await db
        .select()
        .from(request)
        .where(eq(request.id, input.requestId));

      const existingRequest = existingRequests[0];

      if (!existingRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Request not found",
        });
      }

      if (existingRequest.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Request was already dealt with",
        });
      }

      if (existingRequest.receiverId !== ctx.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not the receiver of this request",
        });
      }

      if (input.status === "accept") {
        const promies = [
          db
            .update(request)
            .set({
              status: "accepted",
            })
            .where(eq(request.id, existingRequest.id)),
          db.insert(participation).values({
            userId: ctx.userId,
            tournamentId: existingRequest.tournamentId,
          }),
        ];

        await Promise.all(promies);
      } else if (input.status === "reject") {
        await db
          .update(request)
          .set({
            status: "declined",
          })
          .where(eq(request.id, existingRequest.id));
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid status",
        });
      }
    }),
});
