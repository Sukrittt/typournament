import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import _debounce from "lodash/debounce";
// @ts-ignore
import useSound from "use-sound";

import { User } from "~/db/schema";
import { AnnouncementRoundFlow } from "~/types";
import { TextVariants } from "~/config/motion";
import { RevealWinner } from "./reveal-winner";
import { getCustomizedUserName } from "~/lib/utils";

interface AnnounceWinnerProps {
  winner: User | null;
  loser: User | null;
  winnerAvg: number;
  loserAvg: number;
  drawAvg: number | null;
  newRecord: boolean;
  tournamentId: number;
}

type AnnouncementStep =
  | "thrill"
  | "alright"
  | "calculation"
  | "announcement"
  | "declare";

const uefaMusic = "/music/uefa.mp3";

type FireWorks = "start" | "stop" | null;

export const AnnounceWinner: FC<AnnounceWinnerProps> = ({
  winner,
  loser,
  loserAvg,
  winnerAvg,
  drawAvg,
  newRecord,
  tournamentId,
}) => {
  const [startFireWorks, setStartFireWorks] = useState<FireWorks>(null);
  const setDebouncedStartFireWorks = _debounce(setStartFireWorks, 50);

  const [announcementStep, setAnnouncementStep] =
    useState<AnnouncementStep>("thrill");

  const getDeclarationTitle = () => {
    if (!winner || !loser) {
      return "Tie between the two participants";
    }

    return `Congratulations ${getCustomizedUserName({
      username: winner.name,
    })}!`;
  };

  const announceRoundFlow: Record<AnnouncementStep, AnnouncementRoundFlow> = {
    thrill: {
      title: "Can you feel the thrill?",
      onNextStep: () => setAnnouncementStep("alright"),
    },
    alright: {
      title: "Alright then...",
      onNextStep: () => setAnnouncementStep("calculation"),
    },
    calculation: {
      title: "Calculating the results...",
      onNextStep: () => setAnnouncementStep("announcement"),
    },
    announcement: {
      title: "And the winner is...",
      onNextStep: () => setAnnouncementStep("declare"),
    },
    declare: {
      title: getDeclarationTitle(),
      winner,
      loser,
    },
  };

  const startTimer = () => {
    setAnnouncementStep("thrill");

    const almostTimerId = setTimeout(() => {
      setAnnouncementStep("alright");
    }, 3000);

    const calculationTimerId = setTimeout(() => {
      clearTimeout(almostTimerId);
      setAnnouncementStep("calculation");
    }, 6000);

    const announcementTimerId = setTimeout(() => {
      clearTimeout(calculationTimerId);
      setAnnouncementStep("announcement");
    }, 11000);

    setTimeout(() => {
      clearTimeout(announcementTimerId);
      setAnnouncementStep("declare");
      setDebouncedStartFireWorks("start");
    }, 18000);
  };

  const [_, { sound }] = useSound(uefaMusic, {
    onplay: () => {
      startTimer();
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

  return (
    <div className="flex items-center justify-center">
      {announcementStep === "thrill" && (
        <motion.h1
          className="text-2xl font-extrabold"
          variants={TextVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {announceRoundFlow[announcementStep].title}
        </motion.h1>
      )}
      {announcementStep === "alright" && (
        <motion.h1
          className="text-2xl font-extrabold"
          variants={TextVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {announceRoundFlow[announcementStep].title}
        </motion.h1>
      )}
      {announcementStep === "calculation" && (
        <motion.h1
          className="text-2xl font-extrabold"
          variants={TextVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {announceRoundFlow[announcementStep].title}
        </motion.h1>
      )}
      {announcementStep === "announcement" && (
        <motion.h1
          className="text-2xl font-extrabold"
          variants={TextVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {announceRoundFlow[announcementStep].title}
        </motion.h1>
      )}
      {announcementStep === "declare" && (
        <RevealWinner
          title={announceRoundFlow[announcementStep].title}
          winner={winner}
          loser={loser}
          loserAvg={loserAvg}
          winnerAvg={winnerAvg}
          drawAvg={drawAvg}
          newRecord={newRecord}
          startFireWorks={startFireWorks}
          setStartFireWorks={setStartFireWorks}
          tournamentId={tournamentId}
        />
      )}
    </div>
  );
};
