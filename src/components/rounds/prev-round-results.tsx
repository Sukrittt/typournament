import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import { RoundCard } from "~/components/card/round-card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button, buttonVariants } from "~/components/ui/button";
import { ExtendedParticipantType, ExtendedRound } from "~/types";

interface PreviousRoundResultsProps {
  rounds: ExtendedRound[];
  participants: ExtendedParticipantType[];
  tournamentEnded: boolean;
  tournamentId: number;
}

export const PreviousRoundResults: React.FC<PreviousRoundResultsProps> = ({
  rounds,
  participants,
  tournamentId,
  tournamentEnded,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <span className="pt-0.5">Previous Results</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Previous Results</SheetTitle>
          <SheetDescription>
            A total of {rounds.length} rounds have been played.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        {!tournamentEnded && rounds.length === 0 && (
          <div className="w-full flex justify-center">
            <Link
              className={cn(buttonVariants({ variant: "link" }), "text-center")}
              href={`/t/${tournamentId}/add`}
            >
              Add Round Results
            </Link>
          </div>
        )}
        <ScrollArea className="h-[36rem] w-full rounded-md">
          <div className="flex flex-col gap-y-4">
            {rounds.map((round) => (
              <RoundCard
                key={round.round.id}
                round={round}
                participants={participants}
              />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
