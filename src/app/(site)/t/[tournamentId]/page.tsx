import { Suspense } from "react";

import { Tournament } from "~/components/tournament";

interface TournamentPageProps {
  params: {
    tournamentId: string;
  };
}

export default function TournamentPage({ params }: TournamentPageProps) {
  const { tournamentId } = params;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Tournament tournamentId={parseInt(tournamentId)} />
    </Suspense>
  );
}
