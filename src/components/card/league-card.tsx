import Link from "next/link";
import { CalendarCheck, CalendarDays, UserCog, Users } from "lucide-react";

import { League } from "~/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/button";
import { cn, getCustomizedUserName, getFormattedDate } from "~/lib/utils";

export const LeagueCard = ({ league }: { league: League }) => {
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
    <Card>
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
