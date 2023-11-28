import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { cn } from "~/lib/utils";
import { siteConfig } from "~/config";
import { getAuthSession } from "~/lib/auth";
import { Logout } from "~/components/logout";
import UserAvatar from "~/components/avatar";
import { Leagues } from "~/components/leagues";
import { Requests } from "~/components/request";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/button";
import { UserCard } from "~/components/card/user-card";

export default async function Dashboard() {
  const session = await getAuthSession();

  if (!session) redirect("/sign-in");

  return (
    <>
      <div className="absolute w-full pt-4 px-8 top-4">
        <div className="flex justify-between items-center">
          <UserCard user={session.user}>
            <UserAvatar user={session.user} />
          </UserCard>
          <Logout />
        </div>
      </div>
      <div className="h-screen pt-28 flex max-w-5xl flex-col gap-y-8 ">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-extrabold text-popover-foreground">
            {siteConfig.name}.
          </h1>
          <Suspense fallback={<p>Loading...</p>}>
            <Requests />
          </Suspense>
        </div>

        <Link href="/t/create" className={cn(buttonVariants(), "w-full")}>
          Create {siteConfig.name}
        </Link>

        <Separator />
        <Suspense fallback={<p>Loading...</p>}>
          <Leagues />
        </Suspense>
      </div>
    </>
  );
}
