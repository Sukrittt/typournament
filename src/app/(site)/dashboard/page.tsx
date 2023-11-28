import Link from "next/link";
import { Suspense } from "react";

import { cn } from "~/lib/utils";
import { siteConfig } from "~/config";
import { Logout } from "~/components/logout";
import { Leagues } from "~/components/leagues";
import { Requests } from "~/components/request";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/button";

export default async function Dashboard() {
  return (
    <div className="container h-screen pt-28 flex max-w-5xl flex-col gap-y-8 ">
      <Logout />
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
  );
}
