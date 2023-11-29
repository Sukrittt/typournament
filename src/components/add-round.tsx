import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "~/db";
import { tournament } from "~/db/schema";
import { serverClient } from "~/trpc/server-client";
import { AddRoundForm } from "~/components/form/add-round-form";

export const AddRound = async ({ tournamentId }: { tournamentId: number }) => {
  const league = await db
    .select()
    .from(tournament)
    .where(eq(tournament.id, tournamentId));

  if (league.length === 0) redirect("/dashboard");

  if (league[0].endedAt) redirect(`/t/${tournamentId}`);

  const participants = await serverClient.participant.getParticipants({
    tournamentId,
  });

  if (participants.length === 0) redirect("/dashboard");

  return <AddRoundForm participants={participants} />;
};
