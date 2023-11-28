"use client";

import { useState } from "react";
import { httpBatchLink } from "@trpc/react-query";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { trpc } from "~/trpc/client";
import superjson from "superjson";
import { toast } from "sonner";

interface IError {
  code: string;
  message: string;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
          mutations: {
            onError: (error) => {
              const { message } = error as IError;

              toast.error(message);
            },
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/trpc`,
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
