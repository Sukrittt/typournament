import { serverClient } from "~/trpc/server-client";
import { ScrollArea } from "~/components/ui/scroll-area";
import { LeagueCard } from "~/components/card/league-card";

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
    <ScrollArea className="h-[28rem] px-6 w-full rounded-md">
      <div className="grid grid-cols-3 gap-4">
        {leagues.map((league) => (
          <LeagueCard key={league.participation.id} league={league} />
        ))}
      </div>
    </ScrollArea>
  );
};
