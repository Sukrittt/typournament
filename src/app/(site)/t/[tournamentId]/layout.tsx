import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import { db } from "~/db";
import { getAuthSession } from "~/lib/auth";
import { participation, tournament } from "~/db/schema";

export const dynamic = "force-dynamic";

export default async function CreatorPanelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tournamentId: string };
}) {
  const session = await getAuthSession();

  if (!session) redirect("/sign-in");

  const league = await db
    .select()
    .from(tournament)
    .where(eq(tournament.id, parseInt(params.tournamentId)));

  const isParticipant = await db
    .select()
    .from(participation)
    .where(
      and(
        eq(participation.tournamentId, parseInt(params.tournamentId)),
        eq(participation.userId, session.user.id)
      )
    );

  if (isParticipant.length === 0 || league.length === 0) notFound();

  return <>{children}</>;
}
