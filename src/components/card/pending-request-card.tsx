"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hourglass, Loader, Trash2 } from "lucide-react";

import { trpc } from "~/trpc/client";
import { Request, User } from "~/db/schema";
import UserAvatar from "~/components/avatar";
import { getFormattedDate } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { CustomToolTip } from "~/components/ui/custom-tooltip";

export const PendingRequestCard = ({
  user,
  request,
}: {
  user: User;
  request: Request;
}) => {
  const router = useRouter();

  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  const { mutate: removeRequest, isLoading } =
    trpc.request.deleteRequest.useMutation({
      onSuccess: () => {
        router.refresh();
        toast.success("Request deleted successfully");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  return (
    <Card>
      <CardContent className="py-4 px-6 flex items-center justify-between">
        <div className="flex gap-x-4">
          <UserAvatar className="mt-1" user={user} />
          <div className="space-y-1">
            <h4>{user.name}</h4>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-muted-foreground text-sm">
              Request sent on{" "}
              {getFormattedDate(request.createdAt, "do MMM, yyyy")}
            </p>
          </div>
        </div>
        {showDeleteIcon ? (
          <CustomToolTip
            content={<p className="text-xs">Remove pending request.</p>}
          >
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
              onMouseLeave={() => setShowDeleteIcon(false)}
              onClick={() => removeRequest({ requestId: request.id })}
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" />
              )}
            </Button>
          </CustomToolTip>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading}
            onMouseEnter={() => setShowDeleteIcon(true)}
            onMouseLeave={() => setShowDeleteIcon(false)}
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Hourglass className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
