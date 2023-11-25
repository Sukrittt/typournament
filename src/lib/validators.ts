import { z } from "zod";

export const createTournamentSchema = z.object({
  name: z.string().min(3).max(255),
  emailIds: z.string().email().array().min(1).max(10),
});

export type CreateTournamentValidator = z.infer<typeof createTournamentSchema>;

export const createRoundSchema = z.object({
  tournamentId: z.number(),
  winnerId: z.string().optional(),
  draw: z.boolean().optional(),
  rounds: z.array(
    z.object({
      participationId: z.number(),
      average: z.number(),
      point: z.number(),
    })
  ),
});

export type CreateRoundValidator = z.infer<typeof createRoundSchema>;
export type RoundSchema = Omit<
  CreateRoundValidator,
  "tournamentId" | "winnerId" | "draw"
>;
