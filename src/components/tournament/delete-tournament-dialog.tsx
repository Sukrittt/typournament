import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { trpc } from "~/trpc/client";

export function DeleteTournamentDialog({
  tournamentId,
}: {
  tournamentId: number;
}) {
  const router = useRouter();

  const { mutate: deleteTournament, isLoading } =
    trpc.tournament.deleteTournament.useMutation({
      onSuccess: () => {
        toast.success("Tournament deleted successfully.");
        router.push(`/dashboard`);
      },
    });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {isLoading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <span className="cursor-pointer hover:text-destructive hover:underline underline-offset-4">
            Delete
          </span>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            typournament and all participants will lose their progess.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteTournament({ tournamentId })}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
