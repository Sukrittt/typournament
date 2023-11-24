import { eq } from "drizzle-orm";

import { db } from "~/db";
import { createTournamentSchema } from "~/lib/validators";
import { createTRPCRouter, privateProcedure } from "~/server/trpc";
import { participation, request, tournament, users } from "~/db/schema";

export const tournamentRouter = createTRPCRouter({
  getUserTournaments: privateProcedure.query(async ({ ctx }) => {
    const userTournaments = await db
      .select()
      .from(participation)
      .where(eq(participation.userId, ctx.userId))
      .innerJoin(tournament, eq(tournament.id, participation.tournamentId));

    return userTournaments;
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
