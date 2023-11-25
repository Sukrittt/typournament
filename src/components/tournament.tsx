import { Fragment } from "react";
import { redirect } from "next/navigation";
import { LucideProps } from "lucide-react";
import { serverClient } from "~/trpc/server-client";

import Link from "next/link";
import { Round } from "~/db/schema";
import { getAuthSession } from "~/lib/auth";
import UserAvatar from "~/components/avatar";
import { ExtendedParticipantType } from "~/types";
import { getCustomizedUserName } from "~/lib/utils";
import { FormCircle } from "~/components/form-circle";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/button";
import { useParticipantScores } from "~/hooks/useParticipantScores";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export const dynamic = "force-dynamic";

export const Tournament = async ({
  tournamentId,
}: {
  tournamentId: number;
}) => {
  const session = await getAuthSession();

  if (!session) redirect("/sign-in");

  const league = await serverClient.tournament.getLeague({ tournamentId });

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {league.tournamentInfo.name}
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Number of Participants: {league.participantCount}
          </p>
        </div>
        <Card className="shadow-sm rounded-lg">
          <CardHeader className="p-3 text-sm text-muted-foreground">
            <div className="grid grid-cols-13 font-semibold items-center">
              <p className="mx-4">Position</p>
              <p className="text-left mx-4 col-span-2">Name</p>
              <p className="mx-4">Played</p>
              <p className="mx-4">Wins</p>
              <p className="mx-4">Draws</p>
              <p className="mx-4">Losses</p>
              <p className="mx-4">Avg</p>
              <p className="mx-4">Points</p>
              <p className="col-span-4">Form</p>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="py-3 px-0 flex flex-col gap-y-2">
            {league.participants.map((participant, index) => (
              <Fragment key={participant.participation.id}>
                <ParticipantRow
                  participant={participant}
                  rounds={league.rounds}
                />
                {index < league.participants.length - 1 && <Separator />}
              </Fragment>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-center mt-8">
        <Link className={buttonVariants()} href={`/t/${tournamentId}/add`}>
          Add Round Results
          <IconArrowright className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

interface ParticipantRowProps {
  participant: ExtendedParticipantType;
  rounds: Round[];
}
const ParticipantRow = ({ participant, rounds }: ParticipantRowProps) => {
  const { totalPoints, totalWins, totalLoss, totalDraw, totalAvg, recentForm } =
    useParticipantScores({
      participant,
      rounds,
    });
  const participantName = getCustomizedUserName({
    username: participant.user.name,
  }); //use short for sm device

  return (
    <div className="grid grid-cols-13 py-2 text-neutral-200 items-center">
      <p>1</p>
      <div className="flex gap-x-2 items-center col-span-2">
        <UserAvatar user={participant.user} className="h-5 w-5" />
        <p className="font-medium text-lg">{participantName}</p>
      </div>
      <p className="text-sm">{rounds.length}</p>
      <p className="text-sm">{totalWins}</p>
      <p className="text-sm">{totalDraw}</p>
      <p className="text-sm">{totalLoss}</p>
      <p className="text-sm">{totalAvg.toFixed(2)}</p>
      <p className="text-sm">{totalPoints}</p>
      <div className="flex justify-around items-center col-span-4">
        {recentForm.map((form, index) => (
          <FormCircle key={index} form={form} />
        ))}
      </div>
    </div>
  );
};

function IconArrowright(props: LucideProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
