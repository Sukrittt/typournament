"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Info, Loader, Trash2 } from "lucide-react";

import { trpc } from "~/trpc/client";
import UserAvatar from "~/components/avatar";
import { getFormattedDate } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Participation, User } from "~/db/schema";
import { Card, CardContent } from "~/components/ui/card";
import { CustomToolTip } from "~/components/ui/custom-tooltip";

interface ParticipationCardProps {
  user: User;
  participation: Participation;
  seshId: string;
}

export const ParticipantionCard: React.FC<ParticipationCardProps> = ({
  participation,
  user,
  seshId,
}) => {
  const router = useRouter();

  const { mutate: removeParticipant, isLoading } =
    trpc.participant.removeParticipant.useMutation({
      onSuccess: () => {
        router.refresh();
        toast.success("Participant deleted successfully.");
      },
    });

  const handleRemoveParticipant = () => {
    removeParticipant({
      participationId: participation.id,
      tournamentId: participation.tournamentId,
    });
  };

  const isCreator = participation.userId === seshId;

  return (
    <Card>
      <CardContent className="py-4 px-6 flex items-center justify-between">
        <div className="flex gap-x-4">
          <UserAvatar className="mt-1" user={user} />
          <div className="space-y-1">
            <h4>{user.name}</h4>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-muted-foreground text-sm">
              Joined on{" "}
              {getFormattedDate(participation.createdAt, "do MMM, yyyy")}
            </p>
          </div>
        </div>
        <CustomToolTip
          content={
            <p className="text-xs">
              {isCreator
                ? "You created this typournament."
                : "Remove Participant."}
            </p>
          }
        >
          {isCreator ? (
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
              onClick={handleRemoveParticipant}
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" />
              )}
            </Button>
          )}
        </CustomToolTip>
      </CardContent>
    </Card>
  );
};
