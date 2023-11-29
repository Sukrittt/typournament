import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-9xl font-bold">404</h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-popover-foreground text-center">
            Oops! Page not found.
          </h2>
          <p className="text-lg text-muted-foreground text-center">
            We couldn&rsquo;t find what you were looking for.
          </p>
        </div>
        <Link className={buttonVariants()} href="/">
          <span className="pt-1">Go Home</span>
        </Link>
      </div>
    </section>
  );
}
