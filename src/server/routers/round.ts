import { db } from "~/db";
import { eq } from "drizzle-orm";

import { createRoundSchema } from "~/lib/validators";
import { round, score, tournament } from "~/db/schema";
import { createTRPCRouter, privateProcedure } from "~/server/trpc";

export const roundRouter = createTRPCRouter({
  addRound: privateProcedure
    .input(createRoundSchema)
    .mutation(async ({ input }) => {
      const createdRound = await db.insert(round).values({
        tournamentId: input.tournamentId,
        winnerId: input.winnerId,
        draw: input.draw,
      });

      const roundId = parseInt(createdRound.insertId);

      const promises = [
        await db.insert(score).values({
          roundId: roundId,
          participationId: input.rounds[0].participationId,
          average: input.rounds[0].average,
          point: input.rounds[0].point,
        }),
        await db.insert(score).values({
          roundId: roundId,
          participationId: input.rounds[1].participationId,
          average: input.rounds[1].average,
          point: input.rounds[1].point,
        }),
      ];

      await Promise.all(promises);

      const roundTournaments = await db
        .select()
        .from(tournament)
        .where(eq(tournament.id, input.tournamentId));

      const roundTournament = roundTournaments[0];

      const roundHighestWPM = Math.max(
        input.rounds[0].average,
        input.rounds[1].average
      );

      if (
        !roundTournament.highestWPM ||
        roundTournament.highestWPM < roundHighestWPM
      ) {
        await db
          .update(tournament)
          .set({
            highestWPM: roundHighestWPM,
            highestWPMUserId: input.winnerId,
          })
          .where(eq(tournament.id, input.tournamentId));

        return { newRecord: true };
      }
    }),
});
