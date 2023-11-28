import Link from "next/link";
import { Hourglass, LockKeyhole, Settings, Users } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export const CreatorSheet = ({ tournamentId }: { tournamentId: number }) => {
  const creatorList = [
    {
      label: "Manage Tournament",
      icon: Settings,
      href: `/t/${tournamentId}/manage`,
    },
    {
      label: "Pending Requests",
      icon: Hourglass,
      href: `/t/${tournamentId}/requests`,
    },
    {
      label: "View Participants",
      icon: Users,
      href: `/t/${tournamentId}/participants`,
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="absolute top-8 right-4">
          <LockKeyhole className="h-4 w-4 mr-2" />
          <span className="pt-1">Creator Panel</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[350px]">
        <SheetHeader>
          <SheetTitle>Creator Panel</SheetTitle>
          <SheetDescription>
            Manage your tournament and view requests.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex flex-col gap-y-2">
          {creatorList.map((list, index) => (
            <Link href={list.href} key={index}>
              <div className="flex gap-x-2 items-center hover:bg-neutral-800 transition p-2 rounded-md text-neutral-300">
                <list.icon className="h-5 w-5" />
                <p className="pt-0.5">{list.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
