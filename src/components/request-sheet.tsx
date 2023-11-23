"use client";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import { ExtendedRequest } from "~/types";

export const RequestSheet = ({ data }: { data: ExtendedRequest }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className="cursor-pointer text-sm text-muted-foreground hover:underline underline-offset-4">
          Tournament Requests
        </span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&rsquo;re
            done.
          </SheetDescription>
        </SheetHeader>
        {data.requests.length === 0 && <p>No requests</p>}
        {data.requests.map((data) => (
          <div key={data.request.id} className="flex flex-col gap-y-4">
            <Label>{data.sender.name}</Label>
          </div>
        ))}
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
