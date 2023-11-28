import { ExtendedParticipantType, ExtendedRound } from "~/types";

interface ParticipantProps {
  participants: ExtendedParticipantType[];
  rounds: ExtendedRound[];
}

export const useSortedParticipants = ({
  participants,
  rounds,
}: ParticipantProps) => {
  const sortedParticipants = participants.map((participant) => {
    const { totalAvgCount, totalPoints } = participant.scores.reduce(
      (accumulator, score) => {
        return {
          totalPoints: accumulator.totalPoints + score.point,
          totalAvgCount: accumulator.totalAvgCount + score.average,
        };
      },
      { totalPoints: 0, totalAvgCount: 0 }
    );
    const totalAvg = rounds.length === 0 ? 0 : totalAvgCount / rounds.length;

    return {
      ...participant,
      totalPoints,
      totalAvg,
    };
  });

  sortedParticipants.sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) {
      return b.totalPoints - a.totalPoints;
    } else {
      return b.totalAvg - a.totalAvg;
    }
  });

  return { sortedParticipants };
};
