import { Suspense } from "react";

import { LoadingScreen } from "~/components/loading-screen";
import { EndTournament } from "~/components/tournament/end-tournament";

interface TournamentRequestsPageProps {
  params: {
    tournamentId: string;
  };
}

const EndTournamentPage = (params: TournamentRequestsPageProps) => {
  const { tournamentId: rawTournamentId } = params.params;
  const tournamentId = parseInt(rawTournamentId);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <EndTournament tournamentId={tournamentId} />
    </Suspense>
  );
};

export default EndTournamentPage;
