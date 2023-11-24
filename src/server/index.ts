import { createTRPCRouter } from "~/server/trpc";
import { requestRouter } from "~/server/routers/request";
import { tournamentRouter } from "~/server/routers/tournament";
import { participationRouter } from "~/server/routers/participant";

export const appRouter = createTRPCRouter({
  request: requestRouter,
  tournament: tournamentRouter,
  participant: participationRouter,
});

export type AppRouter = typeof appRouter;
