import { z } from "zod";

export const createTournamentSchema = z.object({
  name: z.string().min(3).max(255),
  emailIds: z.string().email().array().min(1).max(10),
});

export type CreateTournamentValidator = z.infer<typeof createTournamentSchema>;
