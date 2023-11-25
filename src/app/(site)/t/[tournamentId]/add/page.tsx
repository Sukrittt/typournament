import { Suspense } from "react";

import { AddRound } from "~/components/add-round";

interface CreatePageProps {
  params: {
    tournamentId: string;
  };
}

export default function Create({ params }: CreatePageProps) {
  const { tournamentId: rawTournamentId } = params;
  const tournamentId = parseInt(rawTournamentId);

  return (
    <div className="w-full max-w-sm space-y-2">
      <Suspense fallback={<div>Loading...</div>}>
        <AddRound tournamentId={tournamentId} />
      </Suspense>
    </div>
  );
}
