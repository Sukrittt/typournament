import Link from "next/link";
import {
  CalendarCheck,
  CalendarDays,
  Crown,
  UserCog,
  Users,
} from "lucide-react";

import { League } from "~/types";
import { User } from "~/db/schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/button";
import { TournementEndCard } from "~/components/card/user-card";
import { cn, getCustomizedUserName, getFormattedDate } from "~/lib/utils";

interface LeagueCardProps {
  league: League;
  winner: User | null;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({ league, winner }) => {
  const creationDate = getFormattedDate(
    league.tournament.createdAt,
    "MMM dd, yyyy"
  );
  const joinedDate = getFormattedDate(
    league.participation.createdAt,
    "MMM dd, yyyy"
  );

  const leagueContent = [
    {
      icon: UserCog,
      value: getCustomizedUserName({
        username: league.user.name,
      }),
    },
    {
      icon: CalendarDays,
      value: creationDate,
    },
    {
      icon: Users,
      value: league.participantCount,
    },
    {
      icon: CalendarCheck,
      value: joinedDate,
    },
  ];

  return (
    <Card className="relative">
      {winner && league.tournament.endedAt && (
        <div className="absolute top-2 right-2">
          <TournementEndCard
            winner={winner}
            endedAt={league.tournament.endedAt}
          >
            <Crown className="w-4 h-4 text-yellow-500" />
          </TournementEndCard>
        </div>
      )}
      <CardHeader className="py-3">
        <CardTitle className="text-xl truncate text-center">
          {league.tournament.name}
        </CardTitle>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="grid grid-cols-2 gap-2 pb-3">
        {leagueContent.map((content, index) => (
          <div
            className="flex gap-x-2 items-center text-muted-foreground"
            key={index}
          >
            <content.icon className="h-4 w-4" />
            <span className="text-sm pt-1">{content.value}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="bg-secondary p-3">
        <Link
          href={`/t/${league.tournament.id}`}
          className={cn(buttonVariants({ size: "sm" }), "w-full")}
        >
          View
        </Link>
      </CardFooter>
    </Card>
  );
};
