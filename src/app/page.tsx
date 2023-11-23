import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";

export default function Home() {
  return (
    <section className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl tracking-tighter sm:text-4xl">
            Welcome to <span className="text-blue-500">Typeournament.</span>
          </h1>
          <p className="mx-auto max-w-[700px] md:text-xl text-muted-foreground">
            Challenge Yourself and Elevate Your Skills in the Thrilling Arena of
            Precision Typing Excellence.
          </p>
        </div>
        <Link
          className={cn(
            buttonVariants(),
            "rounded-full py-2 px-7 text-base font-normal"
          )}
          href="/sign-in"
        >
          Start Typing <ArrowRight className="ml-1.5 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
