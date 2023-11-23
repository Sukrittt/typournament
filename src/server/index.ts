import { createTRPCRouter } from "~/server/trpc";
import { exampleRouter } from "~/server/routers/example";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
});

export type AppRouter = typeof appRouter;
