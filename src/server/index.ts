import { createTRPCRouter } from "~/server/trpc";
import { requestRouter } from "~/server/routers/request";
import { tournamentRouter } from "~/server/routers/tournament";

export const appRouter = createTRPCRouter({
  tournament: tournamentRouter,
  request: requestRouter,
});

export type AppRouter = typeof appRouter;
