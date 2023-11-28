"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Ban, Check, Loader } from "lucide-react";
import { notFound, useRouter } from "next/navigation";

import { Request, Tournament, User } from "~/db/schema";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { trpc } from "~/trpc/client";
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
  if (!tournament) notFound();

  const router = useRouter();
  const [requestInProcess, setRequestInProcess] = useState<
    "accept" | "reject" | null
  >(null);

  const { mutate: handleRequest, isLoading } =
    trpc.request.handleRequest.useMutation({
      onSuccess: (_, params) => {
        handleOnSuccess(params.status);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
      onMutate: (params) => {
        setRequestInProcess(params.status);
      },
    });

  const handleOnSuccess = (status: "accept" | "reject") => {
    if (status === "accept") {
      toast.success("Request accepted");
      router.push(`/t/${tournament.id}`);
    } else {
      toast.success("Request declined");
      router.refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between gap-x-2">
          <div className="space-y-2">
            <CardTitle>{requestData.sender.name}</CardTitle>
            <CardDescription>
              Requested to join the tournament &quot;{tournament.name}&quot;
            </CardDescription>
          </div>
          <div className="flex items-end gap-x-2">
            <Button
              size="icon"
              disabled={isLoading}
              className="rounded-full h-8 w-8"
              onClick={() =>
                handleRequest({
                  requestId: requestData.request.id,
                  status: "accept",
                })
              }
            >
              {requestInProcess === "accept" ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              disabled={isLoading}
              className="rounded-full h-8 w-8"
              onClick={() =>
                handleRequest({
                  requestId: requestData.request.id,
                  status: "reject",
                })
              }
            >
              {requestInProcess === "reject" ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
