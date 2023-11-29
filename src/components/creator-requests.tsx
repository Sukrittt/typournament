import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthSession } from "~/lib/auth";
import { serverClient } from "~/trpc/server-client";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PendingRequestCard } from "~/components/card/pending-request-card";

export const CreatorRequests = async ({
  tournamentId,
}: {
  tournamentId: number;
}) => {
  const session = await getAuthSession();

  const { requests, tournament } =
    await serverClient.request.getTournamentRequests({
      tournamentId,
    });

  const creatorList = [
    {
      label: "Manage Tournament",
      href: `/t/${tournamentId}/manage`,
    },
    {
      label: "Add Participants",
      href: `/t/${tournamentId}/requests/add`,
    },
    {
      label: "View Participants",
      href: `/t/${tournamentId}/participants`,
    },
  ];

  if (!session) redirect("/sign-in");

  if (requests.length === 0) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <p className="text-muted-foreground text-sm text-center">
          No Pending Requests
        </p>

        <Separator className="my-2" />
        <div className="flex gap-x-2 items-center">
          {creatorList.map((list, index) => (
            <Link
              key={index}
              href={list.href}
              className={buttonVariants({ variant: "link" })}
            >
              {list.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (!tournament) {
    redirect(`/t/${tournamentId}`);
  }

  return (
    <section className="pt-24 container flex flex-col gap-y-4">
      <div>
        <h1 className="text-2xl font-bold">Pending Requests</h1>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Below are all the requests from participants yet to join the
            tournament.
          </p>
          <Link
            href={`/t/${tournamentId}/requests/add`}
            className={buttonVariants({ variant: "link" })}
          >
            Add Participants
          </Link>
        </div>
      </div>

      <Separator className="my-4" />

      <ScrollArea className="h-[28rem] pr-3 w-full rounded-md">
        <div className="space-y-4">
          {requests.map(({ receiver, request }) => (
            <PendingRequestCard
              key={request.id}
              user={receiver}
              request={request}
            />
          ))}
        </div>
      </ScrollArea>
    </section>
  );
};
