import { Suspense } from "react";

import { LoadingScreen } from "~/components/loading-screen";
import { ManageTournamentUpdation } from "~/components/tournament/manage-tournament";

interface TournamentRequestsPageProps {
  params: {
    tournamentId: string;
  };
}

const ManageTournament = (params: TournamentRequestsPageProps) => {
  const { tournamentId: rawTournamentId } = params.params;
  const tournamentId = parseInt(rawTournamentId);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ManageTournamentUpdation tournamentId={tournamentId} />
    </Suspense>
  );
};

export default ManageTournament;
