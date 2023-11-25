import { serverClient } from "~/trpc/server-client";
import { AddRoundForm } from "./form/add-round-form";
import { redirect } from "next/navigation";

export const AddRound = async ({ tournamentId }: { tournamentId: number }) => {
  const participants = await serverClient.participant.getParticipants({
    tournamentId,
  });

  if (participants.length === 0) redirect(`/dashboard`);

  return <AddRoundForm participants={participants} />;
};
