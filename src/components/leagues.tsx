import { LeagueCard } from "~/components/card/league-card";
import { serverClient } from "~/trpc/server-client";

export const Leagues = async () => {
  const leagues = await serverClient.tournament.getUserParticipations();

  if (leagues.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center">
        No leagues joined yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {leagues.map((league) => (
        <LeagueCard key={league.participation.id} league={league} />
      ))}
    </div>
  );
};
