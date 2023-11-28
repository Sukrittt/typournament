import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import { db } from "~/db";
import { tournament } from "~/db/schema";
import { getAuthSession } from "~/lib/auth";

export const dynamic = "force-dynamic";

export default async function TournamentLayout({
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

  if (league.length === 0) notFound();

  if (league[0].creatorId !== session.user.id) {
    redirect(`/t/${params.tournamentId}`);
  }
  return <>{children}</>;
}
