import { AnimatePresence, motion } from "framer-motion";
import { FC, useEffect } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { User } from "~/db/schema";
import { RoundComponentVariants } from "~/config/motion";
import { ExtendedParticipantType, RoundFlow } from "~/types";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "~/lib/utils";

type Participant = Omit<ExtendedParticipantType, "scores">;

interface SelectParticipantsProps {
  roundFlow: RoundFlow;
  participants: Participant[];
  participantOne: User | null;
  participantTwo: User | null;
  setParticipantOne: (participant: User) => void;
  setParticipantTwo: (participant: User) => void;
}

export const SelectParticipants: FC<SelectParticipantsProps> = ({
  participants,
  participantOne,
  participantTwo,
  setParticipantOne,
  setParticipantTwo,
  roundFlow,
}) => {
  const handleSetUser = (emailId: string, selecting: "one" | "two") => {
    const participant = participants.find(
      (participant) => participant.user.email === emailId
    );

    if (!participant) {
      return toast.error("Something went wrong. Please try again.");
    }

    if (selecting === "one") {
      setParticipantOne(participant.user);
    } else {
      setParticipantTwo(participant.user);
    }
  };

  const participantOneLists = participants.filter(
    (participant) => participant.user.id !== participantTwo?.id
  );
  const participantTwoLists = participants.filter(
    (participant) => participant.user.id !== participantOne?.id
  );

  //automatic next step
  useEffect(() => {
    if (participantOne && participantTwo) {
      roundFlow.onNextStep?.();
    }
  }, [participantOne, participantTwo, roundFlow]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="flex flex-col gap-y-8"
        variants={RoundComponentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="flex flex-col gap-y-12 items-center">
          <div className="flex gap-x-8">
            <Select onValueChange={(value) => handleSetUser(value, "one")}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select participant" />
              </SelectTrigger>
              <SelectContent>
                {participantOneLists.length === 0 ? (
                  <div className="text-sm text-center text-muted-foreground">
                    <p>
                      No enough participants?{" "}
                      <Link
                        className={cn(
                          buttonVariants({ variant: "link" }),
                          "text-muted-foreground p-0 text-sm"
                        )}
                        href={`/t/${participants[0].participation.tournamentId}/requests/add`}
                      >
                        Add them.
                      </Link>
                    </p>
                  </div>
                ) : (
                  participantOneLists.map((participant) => (
                    <SelectItem
                      key={participant.participation.id}
                      value={participant.user.email}
                      className="cursor-pointer"
                    >
                      {participant.user.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-2xl pt-1.5 font-extrabold">
              VS
            </span>
            <Select onValueChange={(value) => handleSetUser(value, "two")}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select participant" />
              </SelectTrigger>
              <SelectContent>
                {participantTwoLists.length === 0 ? (
                  <div className="text-sm text-center text-muted-foreground">
                    <p>
                      No enough participants?{" "}
                      <Link
                        className={cn(
                          buttonVariants({ variant: "link" }),
                          "text-muted-foreground p-0 text-sm"
                        )}
                        href={`/t/${participants[0].participation.tournamentId}/requests/add`}
                      >
                        Add them.
                      </Link>
                    </p>
                  </div>
                ) : (
                  participantTwoLists.map((participant) => (
                    <SelectItem
                      key={participant.participation.id}
                      value={participant.user.email}
                      className="cursor-pointer"
                    >
                      {participant.user.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
