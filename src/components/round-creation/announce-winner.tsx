import { FC } from "react";

import { User } from "~/db/schema";

interface AnnounceWinnerProps {
  winner: User | null;
  loser: User | null;
  winnerAvg: number;
  loserAvg: number;
  newRecord: boolean;
}

export const AnnounceWinner: FC<AnnounceWinnerProps> = ({
  winner,
  loser,
  loserAvg,
  winnerAvg,
  newRecord,
}) => {
  if (!winner || !loser) {
    return <p>Tie between the two participants.</p>;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <p>
        1st Place: {winner?.name} with {winnerAvg} WPM{" "}
        {newRecord && "(New Record)"}
      </p>
      <p>
        2nd Place: {loser?.name} with {loserAvg} WPM
      </p>
    </div>
  );
};
