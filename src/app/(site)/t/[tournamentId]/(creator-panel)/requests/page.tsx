import { Suspense } from "react";

import { CreatorRequests } from "~/components/creator/creator-requests";

interface TournamentRequestsPageProps {
  params: {
    tournamentId: string;
  };
}

const TournamentRequests = (params: TournamentRequestsPageProps) => {
  const { tournamentId: rawTournamentId } = params.params;
  const tournamentId = parseInt(rawTournamentId);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatorRequests tournamentId={tournamentId} />
    </Suspense>
  );
};

export default TournamentRequests;
