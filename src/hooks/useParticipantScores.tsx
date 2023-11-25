import { Round } from "~/db/schema";
import { ExtendedParticipantType } from "~/types";

interface ParticipantRowProps {
  participant: ExtendedParticipantType;
  rounds: Round[];
}

const RECENT_ROUND_COUNT = 5;

export const useParticipantScores = ({
  participant,
  rounds,
}: ParticipantRowProps) => {
  const { totalAvgCount, totalPoints } = participant.scores.reduce(
    (accumulator, score) => {
      return {
        totalPoints: accumulator.totalPoints + score.point,
        totalAvgCount: accumulator.totalAvgCount + score.average,
      };
    },
    { totalPoints: 0, totalAvgCount: 0 }
  );

  const { totalWins, totalLoss, totalDraw } = rounds.reduce(
    (accumulator, round) => {
      const incrementWinCount =
        !round.draw && round.winnerId === participant.user.id ? 1 : 0;
      const incrementLossCount =
        !round.draw && round.winnerId !== participant.user.id ? 1 : 0;
      const incrementDrawCount = round.draw ? 1 : 0;

      return {
        totalWins: accumulator.totalWins + incrementWinCount,
        totalLoss: accumulator.totalLoss + incrementLossCount,
        totalDraw: accumulator.totalDraw + incrementDrawCount,
      };
    },
    { totalWins: 0, totalLoss: 0, totalDraw: 0 }
  );

  const totalAvg = rounds.length === 0 ? 0 : totalAvgCount / rounds.length;

  const recentFormRaw = rounds.slice(0, RECENT_ROUND_COUNT).map((round) => {
    if (round.draw) {
      return "draw" as const;
    } else if (round.winnerId === participant.user.id) {
      return "win" as const;
    } else {
      return "lost" as const;
    }
  });

  const notPlayedCount = RECENT_ROUND_COUNT - recentFormRaw.length;
  const notPlayed = Array.from(
    { length: notPlayedCount },
    () => "nan" as const
  );

  const recentForm = [...recentFormRaw, ...notPlayed];

  return {
    totalPoints,
    totalWins,
    totalLoss,
    totalDraw,
    totalAvg,
    recentForm,
  };
};
