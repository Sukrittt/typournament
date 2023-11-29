import Link from "next/link";
import { redirect } from "next/navigation";

import { ExtendedParticipantType } from "~/types";
import { serverClient } from "~/trpc/server-client";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/button";
import { useSortedParticipants } from "~/hooks/useSortedParticipants";
import { AnnounceWinner } from "~/components/tournament/announce-winner";

export const EndTournament = async ({
  tournamentId,
}: {
  tournamentId: number;
}) => {
  const league = await serverClient.tournament.getLeague({ tournamentId });

  if (league.tournamentInfo.endedAt) redirect(`/t/${tournamentId}`);

  const { sortedParticipants } = useSortedParticipants({
    participants: league.participants,
    rounds: league.rounds,
  });

  const creatorList = [
    {
      label: "Manage Tournament",
      href: `/t/${tournamentId}/manage`,
    },
    {
      label: "Add Participants",
      href: `/t/${tournamentId}/requests/add`,
    },
    {
      label: "View Participants",
      href: `/t/${tournamentId}/participants`,
    },
  ];

  const getParticipatedRoundsByParticipant = (
    participant: ExtendedParticipantType
  ) => {
    return league.rounds.filter((round) => {
      return round.score.some((score) => {
        return score.participationId === participant.participation.id;
      });
    });
  };

  const getParticipantsWithSameAverageAsFirst = () => {
    const firstPlace = sortedParticipants[0];

    const firstPlaceRounds = getParticipatedRoundsByParticipant(firstPlace);

    const firstPlaceAverage =
      firstPlaceRounds.length === 0
        ? 0
        : firstPlace.totalAvg / firstPlaceRounds.length;

    const participantsWithSameAverage = sortedParticipants.filter(
      (participant) => {
        if (participant === firstPlace) {
          return false;
        }

        const participantRounds =
          getParticipatedRoundsByParticipant(participant);
        const participantAverage =
          participantRounds.length === 0
            ? 0
            : participant.totalAvg / participantRounds.length;

        return participantAverage === firstPlaceAverage;
      }
    );

    return participantsWithSameAverage;
  };

  const participantsWithSameAverage = getParticipantsWithSameAverageAsFirst();

  if (sortedParticipants.length < 2) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <p className="text-muted-foreground text-sm text-center">
          We cannot end the tournament with less than 2 participants.
        </p>

        <Separator className="my-2" />
        <div className="flex gap-x-2 items-center">
          {creatorList.map((list, index) => (
            <Link
              key={index}
              href={list.href}
              className={buttonVariants({ variant: "link" })}
            >
              {list.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <AnnounceWinner
      winner={sortedParticipants[0]}
      equalParticipants={participantsWithSameAverage}
      rounds={league.rounds}
      leagueDetails={league.tournamentInfo}
    />
  );
};
