interface TournamentPageProps {
  params: {
    tournamentId: string;
  };
}

export default function Tournament({ params }: TournamentPageProps) {
  const { tournamentId } = params;

  return <div>{tournamentId}</div>;
}
