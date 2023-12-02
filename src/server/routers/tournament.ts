import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";

import { db } from "~/db";
import { createTRPCRouter, privateProcedure } from "~/server/trpc";
import { participationRouter } from "~/server/routers/participant";
import {
  createTournamentSchema,
  updateTournamentSchema,
} from "~/lib/validators";
import {
  Participation,
  Round,
  Score,
  Tournament,
  User,
  participation,
  request,
  round,
  score,
  tournament,
  users,
} from "~/db/schema";
import { ExtendedRound } from "~/types";
import { requestRouter } from "~/server/routers/request";

const getWinner = async (tournamentId: number) => {
  const winnerDetails = await db
    .select()
    .from(tournament)
    .innerJoin(users, eq(users.id, tournament.winnerId))
    .orderBy(desc(tournament.createdAt));

  if (winnerDetails.length === 0) return null;

  const winner = winnerDetails.map((winner) => winner.user);

  return winner[0];
};

export const tournamentRouter = createTRPCRouter({
  getUserParticipations: privateProcedure.query(async ({ ctx }) => {
    const userParticipations = await db
      .select()
      .from(participation)
      .where(eq(participation.userId, ctx.userId))
      .innerJoin(tournament, eq(tournament.id, participation.tournamentId))
      .innerJoin(users, eq(users.id, tournament.creatorId))
      .orderBy(desc(tournament.createdAt));

    const caller = participationRouter.createCaller(ctx);

    const tournamentsWithParticipantCountAndWinner = await Promise.all(
      userParticipations.map(async (league) => {
        const participantCount = await caller.getParticipantCount({
          tournamentId: league.tournament.id,
        });

        const winner = await getWinner(league.tournament.id);

        return { ...league, participantCount, winner };
      })
    );

    return tournamentsWithParticipantCountAndWinner;
  }),
  getLeague: privateProcedure
    .input(
      z.object({
        tournamentId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const caller = participationRouter.createCaller(ctx);

      const promises: [
        Promise<Tournament[]>,
        Promise<number>,
        Promise<{ user: User; participation: Participation }[]>,
        Promise<{ score: Score; round: Round }[]>
      ] = [
        db
          .select()
          .from(tournament)
          .where(eq(tournament.id, input.tournamentId)),
        caller.getParticipantCount({
          tournamentId: input.tournamentId,
        }),
        db
          .select()
          .from(participation)
          .where(eq(participation.tournamentId, input.tournamentId))
          .innerJoin(users, eq(users.id, participation.userId)),
        db
          .select()
          .from(round)
          .where(eq(round.tournamentId, input.tournamentId))
          .innerJoin(score, eq(round.id, score.roundId))
          .orderBy(desc(round.createdAt)),
      ];

      const [selectedTournaments, participantCount, participants, rawRounds] =
        await Promise.all(promises);

      const tournamentInfo = selectedTournaments[0];

      const updatedParticipants = await Promise.all(
        participants.map(async (participant) => {
          const scores = await db
            .select()
            .from(score)
            .where(eq(score.participationId, participant.participation.id));

          return {
            ...participant,
            scores,
          };
        })
      );

      const rounds = getFormattedRounds(rawRounds);

      const tournamentObj = {
        tournamentInfo,
        participants: updatedParticipants,
        rounds,
        participantCount,
      };

      return tournamentObj;
    }),
  createTournament: privateProcedure
    .input(createTournamentSchema)
    .mutation(async ({ ctx, input }) => {
      const createdTournament = await db.insert(tournament).values({
        name: input.name,
        creatorId: ctx.userId,
      });

      const tournamentId = parseInt(createdTournament.insertId);

      const caller = requestRouter.createCaller(ctx);
      const { fewInvalidUsers } = await caller.createRequests({
        tournamentId,
        emailIds: input.emailIds,
      });

      await db.insert(participation).values({
        tournamentId,
        userId: ctx.userId,
      });

      return { tournamentId, fewInvalidUsers };
    }),
  updateTournament: privateProcedure
    .input(updateTournamentSchema)
    .mutation(async ({ ctx, input }) => {
      const existingTournaments = await db
        .select()
        .from(tournament)
        .where(
          and(
            eq(tournament.id, input.tournamentId),
            eq(tournament.creatorId, ctx.userId)
          )
        );

      const existingTournament = existingTournaments[0];

      if (!existingTournament) {
        return new TRPCError({
          code: "NOT_FOUND",
          message: "Tournament was not found.",
        });
      }

      if (existingTournament.creatorId !== ctx.userId) {
        return new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this tournament.",
        });
      }

      await db
        .update(tournament)
        .set({
          name: input.name,
        })
        .where(
          and(
            eq(tournament.id, input.tournamentId),
            eq(tournament.creatorId, ctx.userId)
          )
        );
    }),
  deleteTournament: privateProcedure
    .input(z.object({ tournamentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existingTournaments = await db
        .select()
        .from(tournament)
        .where(
          and(
            eq(tournament.id, input.tournamentId),
            eq(tournament.creatorId, ctx.userId)
          )
        );

      const existingTournament = existingTournaments[0];

      if (!existingTournament) {
        return new TRPCError({
          code: "NOT_FOUND",
          message: "This tournament was not found.",
        });
      }

      if (existingTournament.creatorId !== ctx.userId) {
        return new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this tournament.",
        });
      }

      const promises = [
        db
          .delete(participation)
          .where(eq(participation.tournamentId, input.tournamentId)),
        db.delete(request).where(eq(request.tournamentId, input.tournamentId)),
        db.delete(round).where(eq(round.tournamentId, input.tournamentId)),
        db
          .delete(tournament)
          .where(
            and(
              eq(tournament.id, input.tournamentId),
              eq(tournament.creatorId, ctx.userId)
            )
          ),
      ];

      await Promise.all(promises);
    }),
  endTournament: privateProcedure
    .input(z.object({ tournamentId: z.number(), participantId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existingTournaments = await db
        .select()
        .from(tournament)
        .where(
          and(
            eq(tournament.id, input.tournamentId),
            eq(tournament.creatorId, ctx.userId)
          )
        );

      const existingTournament = existingTournaments[0];

      if (!existingTournament) {
        return new TRPCError({
          code: "NOT_FOUND",
          message: "This tournament was not found.",
        });
      }

      if (existingTournament.creatorId !== ctx.userId) {
        return new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You are not authorized to make changes for this tournament.",
        });
      }

      const rawParticipant = await db
        .select()
        .from(participation)
        .where(eq(participation.id, input.participantId));
      const participant = rawParticipant[0];

      if (!participant) {
        return new TRPCError({
          code: "NOT_FOUND",
          message: "This participant was not found.",
        });
      }

      const rawWinner = await db
        .select()
        .from(users)
        .where(eq(users.id, participant.userId));
      const winner = rawWinner[0];

      if (!winner) {
        return new TRPCError({
          code: "NOT_FOUND",
          message: "This participant was not found.",
        });
      }

      await db
        .update(tournament)
        .set({
          winnerId: winner.id,
          endedAt: new Date(),
        })
        .where(eq(tournament.id, input.tournamentId));
    }),
});

const getFormattedRounds = (rounds: { score: Score; round: Round }[]) => {
  const formattedRounds: ExtendedRound[] = [];

  rounds.forEach(({ round }) => {
    const alreadyPushedRound = !!formattedRounds.find(
      (r) => r.round.id === round.id
    );

    if (alreadyPushedRound) return;

    const roundScores = rounds
      .filter((r) => r.score.roundId === round.id)
      .map((r) => r.score);

    formattedRounds.push({ round, score: roundScores });
  });

  return formattedRounds;
};
