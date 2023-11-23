import { createTRPCRouter, publicProcedure } from "~/server/trpc";

export const exampleRouter = createTRPCRouter({
  getExampleData: publicProcedure.query(async () => {
    return [1, 2, 3, 4, 5];
  }),
});
