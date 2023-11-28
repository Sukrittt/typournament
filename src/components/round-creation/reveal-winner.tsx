import { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { cn } from "~/lib/utils";
import { User } from "~/db/schema";
import { Badge } from "~/components/ui/badge";
import { TextVariants } from "~/config/motion";
import { buttonVariants } from "~/components/ui/button";
import { ConfettiFireWorks } from "~/components/cofetti-fireworks";

interface RevealWinnerProps {
  title: string;
  winner: User | null;
  loser: User | null;
  winnerAvg: number;
  loserAvg: number;
  drawAvg: number | null;
  newRecord: boolean;
  startFireWorks: "start" | "stop" | null;
  setStartFireWorks: (value: "start" | "stop" | null) => void;
  tournamentId: number;
}

export const RevealWinner: FC<RevealWinnerProps> = ({
  title,
  loser,
  loserAvg,
  drawAvg,
  newRecord,
  winner,
  tournamentId,
  winnerAvg,
  startFireWorks,
  setStartFireWorks,
}) => {
  return (
    <>
      <ConfettiFireWorks
        startFireWorks={startFireWorks}
        setStartFireWorks={setStartFireWorks}
      />
      <div className="flex flex-col gap-y-2">
        {newRecord && (
          <motion.div
            className="text-sm text-muted-foreground"
            variants={TextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Badge>New Record: {winnerAvg} WPM</Badge>
          </motion.div>
        )}

        {winner && loser && (
          <motion.h1
            className="text-2xl font-extrabold"
            variants={TextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {title}
          </motion.h1>
        )}

        {!winner && !loser && (
          <motion.h1
            className="text-lg font-bold"
            variants={TextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {title} with {drawAvg} WPM.
          </motion.h1>
        )}

        {winner && loser && (
          <motion.p
            className="text-muted-foreground"
            variants={TextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {winner.name} with ({winnerAvg} WPM) beats {loser.name} with (
            {loserAvg} WPM).
          </motion.p>
        )}
        <Link
          href={`/t/${tournamentId}`}
          className={cn(
            buttonVariants({ variant: "link" }),
            "w-fit text-white pl-0"
          )}
        >
          League Table
        </Link>
      </div>
    </>
  );
};
