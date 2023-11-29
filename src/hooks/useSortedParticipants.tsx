import { ExtendedParticipantType, ExtendedRound } from "~/types";

interface ParticipantProps {
  participants: ExtendedParticipantType[];
  rounds: ExtendedRound[];
}

export const useSortedParticipants = ({
  participants,
  rounds,
}: ParticipantProps) => {
  const getParticipatedRoundsByParticipant = (
    participant: ExtendedParticipantType
  ) => {
    return rounds.filter((round) => {
      return round.score.some((score) => {
        return score.participationId === participant.participation.id;
      });
    });
  };

  const sortedParticipants = participants.map((participant) => {
    const participatedRounds = getParticipatedRoundsByParticipant(participant);

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
      participatedRounds.length === 0
        ? 0
        : totalAvgCount / participatedRounds.length;

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

  type SortedParticipantType = (typeof sortedParticipants)[0];

  const getPrevRoundParticipantDetails = (
    participant: SortedParticipantType
  ) => {
    const participatedRounds = getParticipatedRoundsByParticipant(participant);

    const prevRound = participatedRounds[0];
    const prevRoundParticipantScore = prevRound?.score.find(
      (score) => score.participationId === participant.participation.id
    );

    const totalPoints =
      participant.totalPoints - (prevRoundParticipantScore?.point ?? 0);
    const totalAvgCount =
      participant.totalAvg * participatedRounds.length -
      (prevRoundParticipantScore?.average ?? 0);

    const prevRoundParticipantDetails: SortedParticipantType = {
      ...participant,
      totalPoints,
      totalAvg: totalAvgCount / participatedRounds.length,
    };

    return prevRoundParticipantDetails;
  };

  const prevRoundParticipants = sortedParticipants.map((participant) =>
    getPrevRoundParticipantDetails(participant)
  );

  prevRoundParticipants.sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) {
      return b.totalPoints - a.totalPoints;
    } else {
      return b.totalAvg - a.totalAvg;
    }
  });

  return { sortedParticipants, prevRoundParticipants };
};
