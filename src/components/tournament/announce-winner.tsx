"use client";

import { useState, useEffect } from "react";
import _debounce from "lodash/debounce";
// @ts-ignore
import useSound from "use-sound";
import { useRouter } from "next/navigation";

import { trpc } from "~/trpc/client";
import { Tournament } from "~/db/schema";
import { ShowWinner } from "~/components/tournament/show-winner";
import { SelectWinner } from "~/components/tournament/select-winner";
import { ExtendedParticipantType, ExtendedRound, RoundFlow } from "~/types";

const uefaMusic = "/music/uefa.mp3";

interface AnnounceWinnerProps {
  winner: ExtendedParticipantType;
  equalParticipants: ExtendedParticipantType[];
  rounds: ExtendedRound[];
  leagueDetails: Tournament;
}

type AddRoundStep = "select-winner" | "announce-winner";

export const AnnounceWinner: React.FC<AnnounceWinnerProps> = ({
  winner,
  equalParticipants,
  rounds,
  leagueDetails,
}) => {
  const router = useRouter();

  const [step, setStep] = useState<AddRoundStep>(
    equalParticipants.length > 0 ? "select-winner" : "announce-winner"
  );
  const [winningParticipant, setWinningParticipant] = useState(
    equalParticipants.length > 0 ? null : winner
  );

  const [startFireWorks, setStartFireWorks] = useState<"start" | "stop" | null>(
    null
  );
  const setDebouncedStartFireWorks = _debounce(setStartFireWorks, 50);

  const roundFlow: Record<AddRoundStep, RoundFlow> = {
    "select-winner": {
      onNextStep: () => setStep("announce-winner"),
    },
    "announce-winner": {},
  };

  const [_, { sound }] = useSound(uefaMusic, {
    onplay: () => {
      setDebouncedStartFireWorks("start");
    },
    onend: () => {
      setDebouncedStartFireWorks("stop");
    },
    format: ["mp3"],
  });

  useEffect(() => {
    sound?.play();

    return () => sound?.unload();
  }, [sound]);

  const { mutate: endTournament } = trpc.tournament.endTournament.useMutation();

  useEffect(() => {
    if (winningParticipant) {
      endTournament({
        tournamentId: leagueDetails.id,
        participantId: winningParticipant.participation.id,
      });
    }
  }, [winningParticipant, endTournament, leagueDetails.id]);

  return (
    <div className="h-screen flex items-center justify-center">
      {step === "select-winner" && (
        <SelectWinner
          participantOne={winner}
          equalParticipants={equalParticipants}
          rounds={rounds}
          setWinningParticipant={setWinningParticipant}
          roundFlow={roundFlow[step]}
        />
      )}
      {winningParticipant && step === "announce-winner" && (
        <ShowWinner
          winner={winningParticipant}
          leagueDetails={leagueDetails}
          rounds={rounds}
          startFireWorks={startFireWorks}
          setStartFireWorks={setStartFireWorks}
        />
      )}
    </div>
  );
};
