import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { Tournament } from "~/db/schema";
import UserAvatar from "~/components/avatar";
import { getCustomizedUserName } from "~/lib/utils";
import { RoundComponentVariants } from "~/config/motion";
import { ExtendedParticipantType, ExtendedRound } from "~/types";
import { useParticipantScores } from "~/hooks/useParticipantScores";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ConfettiFireWorks } from "~/components/cofetti-fireworks";

interface ShowWinnerProps {
  winner: ExtendedParticipantType;
  leagueDetails: Tournament;
  rounds: ExtendedRound[];
  startFireWorks: "start" | "stop" | null;
  setStartFireWorks: (value: "start" | "stop" | null) => void;
}

export const ShowWinner: React.FC<ShowWinnerProps> = ({
  winner,
  leagueDetails,
  rounds,
  setStartFireWorks,
  startFireWorks,
}) => {
  const participantDetails = useParticipantScores({
    participant: winner,
    rounds,
  });

  const { totalAvgCount, totalPoints } = winner.scores.reduce(
    (accumulator, score) => {
      return {
        totalPoints: accumulator.totalPoints + score.point,
        totalAvgCount: accumulator.totalAvgCount + parseInt(score.average),
      };
    },
    { totalPoints: 0, totalAvgCount: 0 }
  );

  const totalAvg =
    participantDetails.totalPlayed === 0
      ? 0
      : totalAvgCount / participantDetails.totalPlayed;

  const participantStats = [
    {
      label: `Played: ${participantDetails.totalPlayed}`,
    },
    {
      label: `Points: ${totalPoints}`,
    },
    {
      label: `Wins: ${participantDetails.totalWins}`,
    },
    {
      label: `Lost: ${participantDetails.totalLoss}`,
    },
    {
      label: `Draws: ${participantDetails.totalDraw}`,
    },
    {
      label: `Average WPM: ${totalAvg}`,
    },
  ];

  return (
    <>
      <ConfettiFireWorks
        startFireWorks={startFireWorks}
        setStartFireWorks={setStartFireWorks}
      />
      <AnimatePresence mode="wait">
        <motion.div
          variants={RoundComponentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="px-8"
        >
          <Card className="max-w-md">
            <CardHeader>
              <div className="flex gap-x-4">
                <UserAvatar user={winner.user} />
                <div className="space-y-2">
                  <CardTitle>
                    Congratulations{" "}
                    {getCustomizedUserName({ username: winner.user.name })},
                  </CardTitle>
                  <CardDescription>
                    You are the champion of{" "}
                    <Link
                      href={`/t/${leagueDetails.id}`}
                      className="font-bold hover:underline underline-offset-4"
                    >
                      {leagueDetails.name}
                    </Link>
                    .
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center flex-wrap gap-4 text-sm">
                {participantStats.map((stats, index) => (
                  <div
                    key={index}
                    className="py-2 pt-2.5 px-4 bg-zinc-800 rounded-full"
                  >
                    {stats.label}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link
                href={`/t/${leagueDetails.id}`}
                className="text-sm hover:underline underline-offset-4"
              >
                League Table
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
