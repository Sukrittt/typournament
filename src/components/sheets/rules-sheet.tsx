import { BookOpen } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { rules, siteConfig } from "~/config";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "../ui/scroll-area";

export const RulesSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="absolute bottom-6 right-6 cursor-pointer text-sm hover:text-muted-foreground transition">
          <div className="flex gap-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Rules</span>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="min-w-[500px]">
        <SheetHeader>
          <SheetTitle>{siteConfig.name} Rules</SheetTitle>
          <SheetDescription>
            View the rules for {siteConfig.name}.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="pt-6 h-[38rem] pr-3 w-full rounded-md">
          <div className="flex flex-col gap-y-6">
            {rules.map((rule, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-base font-medium">{rule.title}</h3>
                <Separator className="my-1" />
                {rule.steps.map((step, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    {index + 1}. {step}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <p className="pt-5">
            Get ready to experience the joy of friendly competition in the world
            of typing!
          </p>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
