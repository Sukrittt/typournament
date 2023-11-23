import Link from "next/link";

import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { CreateTournament } from "~/components/form/create-tournament";

export default function Create() {
  return (
    <>
      <Link
        href="/dashboard"
        className={cn(
          buttonVariants({ variant: "link" }),
          "text-white absolute left-10 top-10"
        )}
      >
        Go Back
      </Link>
      <CreateTournament />
    </>
  );
}
