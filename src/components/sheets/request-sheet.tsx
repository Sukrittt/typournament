import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { siteConfig } from "~/config";
import { ExtendedRequest } from "~/types";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { RequestCard } from "~/components/card/request-card";

export const RequestSheet = ({ data }: { data: ExtendedRequest }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className="cursor-pointer text-sm text-muted-foreground hover:underline underline-offset-4">
          {siteConfig.name} Requests ({data.requests.length})
        </span>
      </SheetTrigger>
      <SheetContent className="sm:min-w-[600px]">
        <SheetHeader>
          <SheetTitle>{siteConfig.name} Requests</SheetTitle>
          <SheetDescription>
            View your tournament requests and their status.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        {data.requests.length === 0 && (
          <p className="text-sm text-muted-foreground text-center pt-4">
            There are currently no requests.
          </p>
        )}
        <ScrollArea className="h-[36rem] pr-3 w-full rounded-md">
          <div className="flex flex-col gap-y-4">
            {data.requests.map((singleRequest) => (
              <RequestCard
                key={singleRequest.request.id}
                requestData={singleRequest}
                tournament={data.tournament}
              />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
