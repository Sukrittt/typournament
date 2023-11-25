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
import { ExtendedParticipantType, RoundFlow } from "~/types";

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
    <div className="flex flex-col gap-y-12 items-center">
      <div className="flex gap-x-8">
        <Select onValueChange={(value) => handleSetUser(value, "one")}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select participant" />
          </SelectTrigger>
          <SelectContent>
            {participantOneLists.map((participant) => (
              <SelectItem
                key={participant.participation.id}
                value={participant.user.email}
                className="cursor-pointer"
              >
                {participant.user.name}
              </SelectItem>
            ))}
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
            {participantTwoLists.map((participant) => (
              <SelectItem
                key={participant.participation.id}
                value={participant.user.email}
                className="cursor-pointer"
              >
                {participant.user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
