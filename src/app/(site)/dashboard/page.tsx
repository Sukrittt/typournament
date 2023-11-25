import Link from "next/link";
import { Suspense } from "react";

import { cn } from "~/lib/utils";
import { Logout } from "~/components/logout";
import { Leagues } from "~/components/leagues";
import { Requests } from "~/components/request";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/button";
import { getAuthSession } from "~/lib/auth";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getAuthSession();

  return (
    <div className="container h-screen flex justify-center max-w-5xl flex-col gap-y-8 ">
      <Logout />
      {session?.user.email}
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-extrabold">Typeournament.</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <Requests />
        </Suspense>
      </div>

      <Link href="/t/create" className={cn(buttonVariants(), "w-full")}>
        Create Typournament
      </Link>

      <Separator />
      <Suspense fallback={<p>Loading...</p>}>
        <Leagues />
      </Suspense>
    </div>
  );
}
