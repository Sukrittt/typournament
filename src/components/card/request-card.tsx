import { Ban, Check } from "lucide-react";

import { Request, Tournament, User } from "~/db/schema";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

type RequestType = {
  request: Request;
  sender: User;
};

export const RequestCard = ({
  requestData,
  tournament,
}: {
  requestData: RequestType;
  tournament: Tournament | null;
}) => {
  if (!tournament) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="space-y-2">
            <CardTitle>{requestData.sender.name}</CardTitle>
            <CardDescription>
              Requested to join the tournament &quot;{tournament.name}&quot;
            </CardDescription>
          </div>
          <div className="flex items-end gap-x-2">
            <Button size="icon" className="rounded-full h-8 w-8">
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-8 w-8"
            >
              <Ban className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
