import { FC, useCallback, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { User } from "~/db/schema";
import { RoundFlow } from "~/types";
import { trpc } from "~/trpc/client";
import { RoundScenario } from "~/config";
import { Input } from "~/components/ui/input";
import { RoundSchema } from "~/lib/validators";
import { Button } from "~/components/ui/button";
import { RoundComponentVariants } from "~/config/motion";
import { getCustomizedUserName, isValidFloat } from "~/lib/utils";
import UserAvatar from "../avatar";

interface AddResulsProps {
  participantOne: User | null;
  participantTwo: User | null;
  setParticipantOne: (user: User | null) => void;
  setParticipantTwo: (user: User | null) => void;
  setWinner: (user: User) => void;
  setLoser: (user: User) => void;
  participantOnePId: number | undefined;
  participantTwoPId: number | undefined;
  tournamentId: number;
  roundFlow: RoundFlow;
  setWinnerAvg: (avg: number) => void;
  setLoserAvg: (avg: number) => void;
  setDrawAvg: (avg: number) => void;
  setNewRecord: (newRecord: boolean) => void;
}

export const AddResults: FC<AddResulsProps> = ({
  participantOne,
  participantTwo,
  setParticipantOne,
  setParticipantTwo,
  setWinner,
  setLoser,
  participantOnePId,
  participantTwoPId,
  tournamentId,
  setLoserAvg,
  setWinnerAvg,
  setDrawAvg,
  roundFlow,
  setNewRecord,
}) => {
  const router = useRouter();

  const [participantOneRounds, setParticipantOneRounds] = useState<string[]>(
    []
  );
  const [participantTwoRounds, setParticipantTwoRounds] = useState<string[]>(
    []
  );

  const handleParticipantOneRoundChange = useCallback(
    (index: number, value: string) => {
      const updatedRounds = [...participantOneRounds];
      updatedRounds[index] = value;
      setParticipantOneRounds(updatedRounds);
    },
    [participantOneRounds]
  );

  const handleParticipantTwoRoundChange = useCallback(
    (index: number, value: string) => {
      const updatedRounds = [...participantTwoRounds];
      updatedRounds[index] = value;
      setParticipantTwoRounds(updatedRounds);
    },
    [participantTwoRounds]
  );

  const isValidated = () => {
    for (const round of participantOneRounds) {
      if (!isValidFloat(parseFloat(round))) {
        return false;
      }
    }

    for (const round of participantTwoRounds) {
      if (!isValidFloat(parseFloat(round))) {
        return false;
      }
    }

    return true;
  };

  const calculateAverage = () => {
    const participantOneTotal = participantOneRounds.reduce(
      (acc, score) => acc + parseFloat(score),
      0
    );
    const participantTwoTotal = participantTwoRounds.reduce(
      (acc, score) => acc + parseFloat(score),
      0
    );

    return {
      participantOneAvg: parseFloat((participantOneTotal / 3).toFixed(2)),
      participantTwoAvg: parseFloat((participantTwoTotal / 3).toFixed(2)),
    };
  };

  if (!participantOne || !participantTwo) {
    roundFlow.onBackStep?.();
    return null;
  }

  const determineWinner = ({ rounds }: RoundSchema) => {
    let winnerId: string | undefined;
    let draw: boolean | undefined;

    if (rounds[0].point === RoundScenario.DRAW) {
      draw = true;
    } else if (rounds[0].point === RoundScenario.WIN) {
      winnerId = participantOne.id;
    } else if (rounds[1].point === RoundScenario.WIN) {
      winnerId = participantTwo.id;
    }

    return { winnerId, draw };
  };

  const calculatePoint = (
    participantOneAvg: number,
    participantTwoAvg: number
  ) => {
    if (participantOneAvg > participantTwoAvg) {
      return RoundScenario.WIN;
    } else if (participantOneAvg === participantTwoAvg) {
      return RoundScenario.DRAW;
    } else {
      return RoundScenario.LOSS;
    }
  };

  const handleSetWinnerAndLosers = (
    winnerId: string | undefined,
    averages: number[]
  ) => {
    if (!winnerId) {
      setDrawAvg(averages[0]);
      return;
    }

    switch (winnerId) {
      case participantOne.id:
        setWinnerAvg(averages[0]);
        setLoserAvg(averages[1]);

        setWinner(participantOne);
        setLoser(participantTwo);
        break;

      case participantTwo.id:
        setWinnerAvg(averages[1]);
        setLoserAvg(averages[0]);

        setWinner(participantTwo);
        setLoser(participantOne);

        break;

      default:
        toast.error("Something went wrong.");
        break;
    }
  };

  const handleAddResults = () => {
    if (!isValidated()) {
      toast.error("Please enter a valid score!");
      return;
    }

    if (!participantOnePId || !participantTwoPId) {
      toast.error("Something went wrong!");
      return;
    }

    const { participantOneAvg, participantTwoAvg } = calculateAverage();

    const rounds = [
      {
        participationId: participantOnePId,
        average: participantOneAvg,
        point: calculatePoint(participantOneAvg, participantTwoAvg),
      },
      {
        participationId: participantTwoPId,
        average: participantTwoAvg,
        point: calculatePoint(participantTwoAvg, participantOneAvg),
      },
    ];

    const { winnerId, draw } = determineWinner({ rounds });

    handleSetWinnerAndLosers(winnerId, [participantOneAvg, participantTwoAvg]);

    addRound({
      tournamentId,
      rounds,
      winnerId,
      draw,
    });
  };

  const { mutate: addRound, isLoading } = trpc.round.addRound.useMutation({
    onSuccess: (response) => {
      router.refresh();

      if (response && response.newRecord) {
        setNewRecord(true);
      }

      roundFlow.onNextStep?.();
    },
  });

  const handleGoBack = () => {
    setParticipantOne(null);
    setParticipantTwo(null);
    roundFlow.onBackStep?.();
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="flex flex-col gap-y-8"
        variants={RoundComponentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="flex items-center justify-center gap-x-8">
          <div className="space-y-4">
            <h1 className="font-bold text-2xl text-center text-neutral-200 pt-1.5">
              {getCustomizedUserName({ username: participantOne.name })}
            </h1>

            <div className="flex flex-col gap-y-8">
              <Input
                placeholder="Round 1"
                disabled={isLoading}
                value={participantOneRounds[0] ?? ""}
                onChange={(e) =>
                  handleParticipantOneRoundChange(0, e.target.value)
                }
              />
              <Input
                placeholder="Round 2"
                disabled={isLoading}
                value={participantOneRounds[1] ?? ""}
                onChange={(e) =>
                  handleParticipantOneRoundChange(1, e.target.value)
                }
              />
              <Input
                placeholder="Round 3"
                disabled={isLoading}
                value={participantOneRounds[2] ?? ""}
                onChange={(e) =>
                  handleParticipantOneRoundChange(2, e.target.value)
                }
              />
            </div>
          </div>
          <div className="flex gap-x-3 items-center mt-12">
            <UserAvatar user={participantOne} className="h-6 w-6" />
            <span className="text-muted-foreground text-2xl mt-1.5 font-extrabold">
              VS
            </span>
            <UserAvatar user={participantTwo} className="h-6 w-6" />
          </div>
          <div className="space-y-4">
            <h1 className="font-bold text-2xl text-center text-neutral-200 pt-1.5">
              {getCustomizedUserName({ username: participantTwo.name })}
            </h1>

            <div className="flex flex-col gap-y-8">
              <Input
                placeholder="Round 1"
                disabled={isLoading}
                value={participantTwoRounds[0] ?? ""}
                onChange={(e) =>
                  handleParticipantTwoRoundChange(0, e.target.value)
                }
              />
              <Input
                placeholder="Round 2"
                disabled={isLoading}
                value={participantTwoRounds[1] ?? ""}
                onChange={(e) =>
                  handleParticipantTwoRoundChange(1, e.target.value)
                }
              />
              <Input
                placeholder="Round 3"
                disabled={isLoading}
                value={participantTwoRounds[2] ?? ""}
                onChange={(e) =>
                  handleParticipantTwoRoundChange(2, e.target.value)
                }
              />
            </div>
          </div>
        </div>
        <div className="flex gap-x-2 w-full">
          <Button
            onClick={handleGoBack}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            <span className="pt-1">Go Back</span>
          </Button>
          <Button
            onClick={handleAddResults}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <span className="pt-1">Kick Off</span>
            )}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
