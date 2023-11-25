"use client";

import { useState } from "react";

import { ExtendedParticipantType, RoundFlow } from "~/types";

import { User } from "~/db/schema";
import { AddRound } from "~/components/add-round";
import { SelectParticipants } from "~/components/round-creation/select-participants";
import { AnnounceWinner } from "~/components/round-creation/announce-winner";
import { AddResults } from "~/components/round-creation/add-results";

type Participant = Omit<ExtendedParticipantType, "scores">;

type AddRoundStep =
  | "select-participants"
  | "add-round-results"
  | "announce-winner";

export const AddRoundForm = ({
  participants,
}: {
  participants: Participant[];
}) => {
  const [step, setStep] = useState<AddRoundStep>("select-participants");
  const [participantOne, setParticipantOne] = useState<User | null>(null);
  const [participantTwo, setParticipantTwo] = useState<User | null>(null);

  const [winner, setWinner] = useState<User | null>(null);
  const [loser, setLoser] = useState<User | null>(null);

  const [winnerAvg, setWinnerAvg] = useState(0);
  const [loserAvg, setLoserAvg] = useState(0);

  const [newRecord, setNewRecord] = useState(false);

  const roundFlow: Record<AddRoundStep, RoundFlow> = {
    "select-participants": {
      onNextStep: () => setStep("add-round-results"),
    },
    "add-round-results": {
      onNextStep: () => setStep("announce-winner"),
      onBackStep: () => setStep("add-round-results"),
    },
    "announce-winner": {
      onBackStep: () => setStep("add-round-results"),
    },
  };

  const participantOnePId = participants.find(
    (participant) => participant.user.id === participantOne?.id
  )?.participation.id;

  const participantTwoPId = participants.find(
    (participant) => participant.user.id === participantTwo?.id
  )?.participation.id;

  return (
    <div className="h-screen flex items-center justify-center">
      {step === "select-participants" && (
        <SelectParticipants
          participants={participants}
          roundFlow={roundFlow[step]}
          participantOne={participantOne}
          participantTwo={participantTwo}
          setParticipantOne={setParticipantOne}
          setParticipantTwo={setParticipantTwo}
        />
      )}
      {step === "add-round-results" && (
        <AddResults
          tournamentId={participants[0].participation.tournamentId}
          participantOne={participantOne}
          participantTwo={participantTwo}
          roundFlow={roundFlow[step]}
          setWinner={setWinner}
          setWinnerAvg={setWinnerAvg}
          setLoserAvg={setLoserAvg}
          setLoser={setLoser}
          participantOnePId={participantOnePId}
          participantTwoPId={participantTwoPId}
          setNewRecord={setNewRecord}
        />
      )}
      {step === "announce-winner" && (
        <AnnounceWinner
          winner={winner}
          loser={loser}
          winnerAvg={winnerAvg}
          loserAvg={loserAvg}
          newRecord={newRecord}
        />
      )}
    </div>
  );
};
