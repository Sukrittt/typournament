import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "~/db";
import { participation, tournament } from "~/db/schema";
import { createTRPCRouter, privateProcedure } from "~/server/trpc";

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
});
