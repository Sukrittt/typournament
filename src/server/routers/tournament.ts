import { z } from "zod";
import { desc, eq } from "drizzle-orm";

import { db } from "~/db";
import { createTournamentSchema } from "~/lib/validators";
import { createTRPCRouter, privateProcedure } from "~/server/trpc";
import { participationRouter } from "~/server/routers/participant";
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

    const tournamentsWithParticipantCount = await Promise.all(
      userParticipations.map(async (league) => {
        const participantCount = await caller.getParticipantCount({
          tournamentId: league.tournament.id,
        });
        return { ...league, participantCount };
      })
    );

    return tournamentsWithParticipantCount;
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

      const parsedEmailIds = input.emailIds.filter(
        (emailId) => emailId !== ctx.emailId
      );

      const requestedUserIds = await getUserIdsByEmail(parsedEmailIds);

      await Promise.all(
        requestedUserIds.map(async (userId) => {
          await sendRequest(ctx.userId, userId, tournamentId);
        })
      );

      await db.insert(participation).values({
        tournamentId,
        userId: ctx.userId,
      });

      return { tournamentId };
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
