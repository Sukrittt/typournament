import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";

import { db } from "~/db";
import { participation, request, tournament, users } from "~/db/schema";
import { createTRPCRouter, privateProcedure } from "~/server/trpc";
import { addParticipantsSchema } from "~/lib/validators";

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
  getTournamentRequests: privateProcedure
    .input(z.object({ tournamentId: z.number() }))
    .query(async ({ input }) => {
      const tournamentRequests = await db
        .select()
        .from(request)
        .where(
          and(
            eq(request.tournamentId, input.tournamentId),
            eq(request.status, "pending")
          )
        )
        .innerJoin(tournament, eq(tournament.id, request.tournamentId))
        .innerJoin(users, eq(request.receiverId, users.id))
        .orderBy(desc(request.createdAt));

      const formattedRequests = {
        tournament:
          tournamentRequests.length > 0
            ? tournamentRequests[0].tournament
            : null,
        requests: tournamentRequests.map((request) => ({
          request: { ...request.request },
          receiver: { ...request.user },
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
  createRequests: privateProcedure
    .input(addParticipantsSchema)
    .mutation(async ({ ctx, input }) => {
      const parsedEmailIds = input.emailIds.filter(
        (emailId) => emailId !== ctx.emailId
      );

      const requestedUserIds = await getUserIdsByEmail(parsedEmailIds);

      await Promise.all(
        requestedUserIds.map(async (userId) => {
          const existingRequest = await db
            .select()
            .from(request)
            .where(
              and(
                eq(request.senderId, ctx.userId),
                eq(request.receiverId, userId),
                eq(request.tournamentId, input.tournamentId)
              )
            );

          if (existingRequest.length > 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Request already exists",
            });
          }

          await sendRequest(ctx.userId, userId, input.tournamentId);
        })
      );
    }),
  deleteRequest: privateProcedure
    .input(z.object({ requestId: z.number() }))
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
          message: "Request was already accepted by the user.",
        });
      }

      if (existingRequest.senderId !== ctx.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not the sender of this request",
        });
      }

      await db.delete(request).where(eq(request.id, existingRequest.id));
    }),
});

const getUserIdsByEmail = async (emailIds: string[]) => {
  const requestUserIds: string[] = (
    await Promise.all(
      emailIds.map(async (emailId) => {
        const user = await db
          .select({
            id: users.id,
          })
          .from(users)
          .where(eq(users.email, emailId));

        if (user && user.length > 0) {
          const userId = user[0].id;
          return userId;
        }
      })
    )
  ).filter((userId) => userId !== undefined) as string[];

  return requestUserIds;
};

const sendRequest = async (
  senderId: string,
  receiverId: string,
  tournamentId: number
) => {
  try {
    await db.insert(request).values({
      tournamentId,
      senderId,
      receiverId,
    });
  } catch (error) {
    console.log("Something went wrong with sending request.", error);
  }
};
