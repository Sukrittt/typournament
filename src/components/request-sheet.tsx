"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { ExtendedRequest } from "~/types";
import { Separator } from "~/components/ui/separator";
import { RequestCard } from "~/components/card/request-card";

export const RequestSheet = ({ data }: { data: ExtendedRequest }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className="cursor-pointer text-sm text-muted-foreground hover:underline underline-offset-4">
          Tournament Requests ({data.requests.length})
        </span>
      </SheetTrigger>
      <SheetContent className="min-w-[600px]">
        <SheetHeader>
          <SheetTitle>Tournament Requests</SheetTitle>
          <SheetDescription>
            View your tournament requests and their status.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        {data.requests.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            There are currently no requests.
          </p>
        )}
        <div className="flex flex-col gap-y-4">
          {data.requests.map((singleRequest) => (
            <RequestCard
              key={singleRequest.request.id}
              requestData={singleRequest}
              tournament={data.tournament}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
