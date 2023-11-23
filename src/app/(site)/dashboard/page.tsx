import Link from "next/link";
import { Suspense } from "react";

import { cn } from "~/lib/utils";
import { Logout } from "~/components/logout";
import { Leagues } from "~/components/leagues";
import { Requests } from "~/components/request";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/button";

export default function Dashboard() {
  return (
    <div className="container h-screen flex justify-center max-w-3xl flex-col gap-y-8 ">
      <Logout />
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-extrabold">Typeournament.</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <Requests />
        </Suspense>
      </div>

      <Link href="/t/create" className={cn(buttonVariants(), "w-full")}>
        Create Tournament
      </Link>

      <Separator />
      <Suspense fallback={<p>Loading...</p>}>
        <Leagues />
      </Suspense>
    </div>
  );
}
