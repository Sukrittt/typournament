import { ExtendedParticipantType, ExtendedRound } from "~/types";

interface RoundToolTipContentProps {
  round: ExtendedRound;
  participants: ExtendedParticipantType[];
}

export const useRoundDetails = ({
  participants,
  round,
}: RoundToolTipContentProps) => {
  const participantOne = participants.find(
    (participant) =>
      participant.participation.id === round.score[0].participationId
  );
  const participantTwo = participants.find(
    (participant) =>
      participant.participation.id === round.score[1].participationId
  );

  const participantOneScore = round.score[0].average;
  const participantTwoScore = round.score[1].average;

  return {
    participantOne,
    participantTwo,
    participantOneScore,
    participantTwoScore,
    round: round.round,
  };
};
