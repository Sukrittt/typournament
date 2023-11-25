import { Round } from "~/db/schema";
import { ExtendedParticipantType } from "~/types";

interface ParticipantRowProps {
  userId: string;
  participant: ExtendedParticipantType;
  rounds: Round[];
}

const FORM_ROUND_COUNT = 5;

export const useParticipantScores = ({
  participant,
  rounds,
  userId,
}: ParticipantRowProps) => {
  const totalPoints = participant.scores.reduce((scoreAccumulator, score) => {
    return scoreAccumulator + score.point;
  }, 0);

  const totalWins = rounds.reduce((winAccumulator, round) => {
    const incrementCount = round.winnerId === userId ? 1 : 0;

    return winAccumulator + incrementCount;
  }, 0);

  const totalLoss = rounds.reduce((lossAccumulator, round) => {
    const incrementCount = round.winnerId !== userId ? 1 : 0;

    return lossAccumulator + incrementCount;
  }, 0);

  const totalAvgCount = participant.scores.reduce((avgAccumulator, score) => {
    return avgAccumulator + score.average;
  }, 0);

  const totalAvg = rounds.length === 0 ? 0 : totalAvgCount / rounds.length;

  const recentFormRaw = rounds.slice(0, FORM_ROUND_COUNT).map((round) => {
    if (round.winnerId === userId) {
      return "win" as const;
    } else {
      return "lost" as const;
    }
  });

  const notPlayedCount = FORM_ROUND_COUNT - recentFormRaw.length;
  const notPlayed = Array.from(
    { length: notPlayedCount },
    () => "nan" as const
  );

  const recentForm = [...recentFormRaw, ...notPlayed];

  return {
    totalPoints,
    totalWins,
    totalLoss,
    totalAvg,
    recentForm,
  };
};
