import { CalendarDays } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import UserAvatar from "~/components/avatar";
import { ExtendedParticipantType } from "~/types";
import { getCustomizedUserName, getFormattedDate } from "~/lib/utils";

interface ParticipantCardProps {
  participant: ExtendedParticipantType;
  children: React.ReactNode;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  children,
}) => {
  const username = getCustomizedUserName({ username: participant.user.name });

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-x-4">
          <UserAvatar user={participant.user} className="h-6 w-6" />

          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-left">
              @{username.toLowerCase()}
            </h4>
            <p className="text-sm">{participant.user.email}</p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined at{" "}
                {getFormattedDate(
                  participant.participation.createdAt,
                  "MMMM yyyy"
                )}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
