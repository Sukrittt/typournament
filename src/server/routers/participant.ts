import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";

import { db } from "~/db";
import { participation, tournament, users } from "~/db/schema";
import { createTRPCRouter, privateProcedure } from "~/server/trpc";
import { TRPCError } from "@trpc/server";

export const participationRouter = createTRPCRouter({
  getParticipantCount: privateProcedure
    .input(
      z.object({
        tournamentId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const participationCount = await db
        .select({
          count: sql`count(*)`.mapWith(Number).as("count"),
        })
        .from(participation)
        .where(eq(participation.tournamentId, input.tournamentId));

      const count = participationCount[0].count;

      return count;
    }),
  getParticipants: privateProcedure
    .input(
      z.object({
        tournamentId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const participants = await db
        .select()
        .from(participation)
        .where(eq(participation.tournamentId, input.tournamentId))
        .innerJoin(users, eq(users.id, participation.userId));

      return participants;
    }),
  removeParticipant: privateProcedure
    .input(
      z.object({
        tournamentId: z.number(),
        participationId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingParticipants = await db
        .select()
        .from(participation)
        .where(
          and(
            eq(participation.tournamentId, input.tournamentId),
            eq(participation.id, input.participationId)
          )
        );

      const existingParticipant = existingParticipants[0];

      if (!existingParticipant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Participant not found",
        });
      }

      if (existingParticipant.userId === ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You cannot remove yourself from the tournament.",
        });
      }

      const existingTournaments = await db
        .select()
        .from(tournament)
        .where(eq(tournament.id, input.tournamentId));

      const existingTournament = existingTournaments[0];

      if (!existingTournament) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tournament not found",
        });
      }

      if (existingTournament.creatorId !== ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not the creator of this tournament",
        });
      }

      await db
        .delete(participation)
        .where(eq(participation.id, input.participationId));
    }),
});
