import { Suspense } from "react";
import { LoadingScreen } from "~/components/loading-screen";

import { Tournament } from "~/components/tournament/tournament";

interface TournamentPageProps {
  params: {
    tournamentId: string;
  };
}

export default function TournamentPage({ params }: TournamentPageProps) {
  const { tournamentId } = params;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Tournament tournamentId={parseInt(tournamentId)} />
    </Suspense>
  );
}
