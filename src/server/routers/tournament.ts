import { eq } from "drizzle-orm";

import { db } from "~/db";
import { participation, tournament } from "~/db/schema";
import { createTRPCRouter, privateProcedure } from "~/server/trpc";

export const tournamentRouter = createTRPCRouter({
  getUserTournaments: privateProcedure.query(async ({ ctx }) => {
    const userTournaments = await db
      .select()
      .from(participation)
      .where(eq(participation.userId, ctx.userId))
      .innerJoin(tournament, eq(tournament.id, participation.tournamentId));

    return userTournaments;
  }),
});
