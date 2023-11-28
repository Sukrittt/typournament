import { User } from "next-auth";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { getCustomizedUserName } from "~/lib/utils";

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
            <h4 className="text-sm font-semibold text-left">
              @{username.toLowerCase()}
            </h4>
            <p className="text-sm">{user.email}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
