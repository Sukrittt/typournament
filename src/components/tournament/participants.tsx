import Link from "next/link";
import { redirect } from "next/navigation";

import { siteConfig } from "~/config";
import { getAuthSession } from "~/lib/auth";
import { serverClient } from "~/trpc/server-client";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ParticipantionCard } from "~/components/card/participation-card";

export const dynamic = "force-dynamic";

export const Participants = async ({
  tournamentId,
}: {
  tournamentId: number;
}) => {
  const session = await getAuthSession();
  const participants = await serverClient.participant.getParticipants({
    tournamentId,
  });

  if (participants.length === 0) redirect("/dashboard");

  if (!session) redirect("/sign-in");

  return (
    <section className="pt-24 container flex flex-col gap-y-4">
      <div>
        <h1 className="text-2xl font-bold">Participants</h1>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            There are {participants.length} participants in this{" "}
            {siteConfig.name.toLowerCase()}.
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

      <ScrollArea className="h-[28rem] px-6 w-full rounded-md">
        <div className="space-y-4">
          {participants.map(({ participation, user }) => (
            <ParticipantionCard
              key={participation.id}
              participation={participation}
              seshId={session.user.id}
              user={user}
            />
          ))}
        </div>
      </ScrollArea>
    </section>
  );
};
