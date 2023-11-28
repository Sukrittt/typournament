import { ExtendedParticipantType, ExtendedRound } from "~/types";

interface ParticipantRowProps {
  participant: ExtendedParticipantType;
  rounds: ExtendedRound[];
}

const RECENT_ROUND_COUNT = 5;

export const useParticipantScores = ({
  participant,
  rounds,
}: ParticipantRowProps) => {
  const { totalWins, totalLoss, totalDraw } = rounds.reduce(
    (accumulator, match) => {
      const incrementWinCount =
        !match.round.draw && match.round.winnerId === participant.user.id
          ? 1
          : 0;
      const incrementLossCount =
        !match.round.draw && match.round.winnerId !== participant.user.id
          ? 1
          : 0;
      const incrementDrawCount = match.round.draw ? 1 : 0;

      return {
        totalWins: accumulator.totalWins + incrementWinCount,
        totalLoss: accumulator.totalLoss + incrementLossCount,
        totalDraw: accumulator.totalDraw + incrementDrawCount,
      };
    },
    { totalWins: 0, totalLoss: 0, totalDraw: 0 }
  );

  const recentFormRaw = rounds.slice(0, RECENT_ROUND_COUNT).map((match) => {
    if (match.round.draw) {
      return { ...match, status: "draw" as const };
    } else if (match.round.winnerId === participant.user.id) {
      return { ...match, status: "win" as const };
    } else {
      return { ...match, status: "loss" as const };
    }
  });

  const notPlayedCount = RECENT_ROUND_COUNT - recentFormRaw.length;
  const notPlayed = Array.from({ length: notPlayedCount }, () => {
    return { ...rounds[0], status: "nan" as const };
  });

  const recentForm = [...recentFormRaw, ...notPlayed];

  return {
    totalWins,
    totalLoss,
    totalDraw,
    recentForm,
  };
};
