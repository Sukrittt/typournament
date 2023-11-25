import { createTRPCRouter } from "~/server/trpc";
import { roundRouter } from "~/server/routers/round";
import { requestRouter } from "~/server/routers/request";
import { tournamentRouter } from "~/server/routers/tournament";
import { participationRouter } from "~/server/routers/participant";

export const appRouter = createTRPCRouter({
  request: requestRouter,
  tournament: tournamentRouter,
  participant: participationRouter,
  round: roundRouter,
});

export type AppRouter = typeof appRouter;
