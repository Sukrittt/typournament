"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useParticipantScores } from "~/hooks/useParticipantScores";

import { getCustomizedUserName } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { trpc } from "~/trpc/client";
import UserAvatar from "~/components/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";
import { RoundComponentVariants, TextVariants } from "~/config/motion";
import { ExtendedParticipantType, ExtendedRound, RoundFlow } from "~/types";

interface SelectWinnerProps {
  rounds: ExtendedRound[];
  participantOne: ExtendedParticipantType;
  equalParticipants: ExtendedParticipantType[];
  roundFlow: RoundFlow;
  setWinningParticipant: (participant: ExtendedParticipantType) => void;
}

export const SelectWinner: React.FC<SelectWinnerProps> = ({
  participantOne,
  roundFlow,
  equalParticipants,
  rounds,
  setWinningParticipant,
}) => {
  return (
    <AnimatePresence mode="wait">
      <div className="flex flex-col gap-y-8 pt-10">
        <div className="space-y-1">
          <motion.h1
            className="text-2xl font-extrabold text-center"
            variants={TextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            There was a tie between the participants.
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground text-center"
            variants={TextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            Select one participant to declare a winner.
          </motion.p>
        </div>
        <ScrollArea className="h-[30rem] w-full rounded-md">
          <div className="grid grid-cols-2 justify-center gap-4 items-center">
            {[participantOne, ...equalParticipants].map((participant) => (
              <ParticipantDetails
                key={participant.user.id}
                participant={participant}
                rounds={rounds}
                setWinningParticipant={setWinningParticipant}
                roundFlow={roundFlow}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </AnimatePresence>
  );
};

interface ParticipantDetailsProps {
  participant: ExtendedParticipantType;
  rounds: ExtendedRound[];
  roundFlow: RoundFlow;
  setWinningParticipant: (participant: ExtendedParticipantType) => void;
}
const ParticipantDetails: React.FC<ParticipantDetailsProps> = ({
  participant,
  rounds,
  roundFlow,
  setWinningParticipant,
}) => {
  const router = useRouter();

  const participantDetails = useParticipantScores({
    participant,
    rounds,
  });

  const { totalAvgCount, totalPoints } = participant.scores.reduce(
    (accumulator, score) => {
      return {
        totalPoints: accumulator.totalPoints + score.point,
        totalAvgCount: accumulator.totalAvgCount + score.average,
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
    <motion.div
      key={participant.user.id}
      variants={RoundComponentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={() => {
        setWinningParticipant(participant);
        roundFlow.onNextStep?.();
      }}
    >
      <Card className="hover:border hover:border-zinc-700 cursor-pointer transition max-w-md">
        <CardHeader>
          <div className="flex gap-x-2">
            <UserAvatar user={participant.user} />
            <div className="space-y-2">
              <CardTitle>
                {getCustomizedUserName({ username: participant.user.name })}
              </CardTitle>
              <CardDescription>{participant.user.email}</CardDescription>
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
      </Card>
    </motion.div>
  );
};
