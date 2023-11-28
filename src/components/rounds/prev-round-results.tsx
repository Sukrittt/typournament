import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";
import { RoundCard } from "~/components/card/round-card";
import { Button, buttonVariants } from "~/components/ui/button";
import { ExtendedParticipantType, ExtendedRound } from "~/types";

interface PreviousRoundResultsProps {
  rounds: ExtendedRound[];
  participants: ExtendedParticipantType[];
  tournamentId: number;
}

export const PreviousRoundResults: React.FC<PreviousRoundResultsProps> = ({
  rounds,
  participants,
  tournamentId,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Previous Results</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Previous Results</SheetTitle>
          <SheetDescription>
            A total of {rounds.length} rounds have been played.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        {rounds.length === 0 && (
          <Link
            className={buttonVariants({ variant: "link" })}
            href={`/t/${tournamentId}/add`}
          >
            Add Round Results
          </Link>
        )}
        <div className="flex flex-col gap-y-4">
          {rounds.map((round) => (
            <RoundCard
              key={round.round.id}
              round={round}
              participants={participants}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
