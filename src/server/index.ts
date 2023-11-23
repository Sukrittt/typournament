import { createTRPCRouter } from "~/server/trpc";
import { tournamentRouter } from "~/server/routers/tournament";

export const appRouter = createTRPCRouter({
  tournament: tournamentRouter,
});

export type AppRouter = typeof appRouter;
