import { Crown } from "lucide-react";

import { User } from "next-auth";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { siteConfig } from "~/config";
import UserAvatar from "~/components/avatar";
import { getCustomizedUserName, getFormattedDate } from "~/lib/utils";

interface UserCardProps {
  user: User;
  children: React.ReactNode;
}

export const UserCard: React.FC<UserCardProps> = ({ user, children }) => {
  const username = getCustomizedUserName({ username: user.name ?? "" });

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="ml-2 py-2">
        <div className="flex gap-x-4">
          <div className="space-y-1">
            <h4 className="text-sm text-left">
              Username:{" "}
              <span className="font-semibold">@{username.toLowerCase()}</span>
            </h4>
            <p className="text-sm">
              Email: <span className="font-semibold">{user.email}</span>
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

interface TournementEndCardProps {
  winner: User;
  children: React.ReactNode;
  endedAt: Date;
}

export const TournementEndCard: React.FC<TournementEndCardProps> = ({
  winner,
  children,
  endedAt,
}) => {
  const username = getCustomizedUserName({ username: winner.name ?? "" });
  const endedOn = getFormattedDate(endedAt, "MMM dd, yy");

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="ml-2 py-2 w-[18rem] relative">
        <div className="absolute right-2 top-2 py-0.5 px-2.5 rounded-full bg-gradient-to-r from-[#000] via-[#1e1e1e] to-[#000]">
          <div className="flex items-center gap-x-1">
            <span className="text-white text-[10px] font-normal pt-0.5">
              Champion
            </span>
            <Crown className="w-3 h-3 text-yellow-500" />
          </div>
        </div>
        <div className="flex gap-x-4">
          <UserAvatar user={winner} />
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-left">
              @{username.toLowerCase()}
            </h4>
            <p className="text-sm">{winner.email}</p>
            <p className="text-xs text-muted-foreground">
              {siteConfig.name} ended on {endedOn}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
