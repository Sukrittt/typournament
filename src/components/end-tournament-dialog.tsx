"use client";

import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

export function EndTournamentDialog({
  tournamentId,
}: {
  tournamentId: number;
}) {
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex gap-x-2 items-center hover:bg-neutral-800 transition p-2 rounded-md text-neutral-300 cursor-pointer">
          <Trophy className="h-5 w-5" />
          <p className="pt-0.5">End Tournament</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently end this
            typournament and the 1st place participant will be declared as
            winner.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <span className="pt-1">Cancel</span>
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => router.push(`/t/${tournamentId}/end`)}
          >
            <span className="pt-1">Continue</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
