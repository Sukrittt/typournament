import { db } from "~/db";
import { eq } from "drizzle-orm";

import { tournament } from "~/db/schema";
import { ManageTournamentForm } from "~/components/form/manage-tournament-form";

export const ManageTournamentUpdation = async ({
  tournamentId,
}: {
  tournamentId: number;
}) => {
  const league = await db
    .select()
    .from(tournament)
    .where(eq(tournament.id, tournamentId));

  return <ManageTournamentForm tournament={league[0]} />;
};
