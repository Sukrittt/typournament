"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader, Plus, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  AddParticipantsValidator,
  addParticipantsSchema,
} from "~/lib/validators";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";
import { ScrollArea } from "~/components/ui/scroll-area";

export const AddParticipantsForm = ({
  tournamentId,
}: {
  tournamentId: number;
}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const form = useForm<AddParticipantsValidator>({
    resolver: zodResolver(addParticipantsSchema),
    defaultValues: {
      emailIds: undefined,
      tournamentId,
    },
  });

  const { mutate: sendRequests, isLoading } =
    trpc.request.createRequests.useMutation({
      onSuccess: ({ fewInvalidUsers }) => {
        if (fewInvalidUsers) {
          toast.error(
            "Few users were not found. Please check the emails you have entered or tell them to create an account."
          );
        } else {
          toast.success("Request sent to the participants.");
        }
        form.reset();
        router.refresh();
        router.push(`/t/${tournamentId}/requests`);
      },
    });

  const isValidEmail = (emailId: string) => {
    try {
      addParticipantsSchema.parse({ emailIds: [emailId], tournamentId });
      return true;
    } catch (error) {
      return false;
    }
  };

  const validEmailDisplay = !!(
    form.getValues().emailIds && form.getValues().emailIds.length
  );

  const handleAddEmail = () => {
    if (!isValidEmail(email)) return toast.error("Invalid email Id.");

    if (form.getValues().emailIds?.includes(email))
      return toast.error("Email Id already added.");

    const initialEmails = form.getValues().emailIds || [];

    form.setValue("emailIds", [...initialEmails, email]);
    setEmail("");
  };

  const handleDeleteEmail = (index: number) => {
    const filteredEmailIds = form
      .getValues()
      .emailIds.filter((_, i) => i !== index);

    form.reset({
      emailIds: filteredEmailIds,
    });
  };

  function onSubmit(content: AddParticipantsValidator) {
    sendRequests(content);
  }

  return (
    <div className="h-screen flex flex-col justify-center w-full px-8 max-w-md space-y-8">
      <div className="space-y-2">
        <Link
          href={`/t/${tournamentId}/requests`}
          className={cn(
            buttonVariants({ variant: "link" }),
            "text-white w-fit pl-0"
          )}
        >
          Go Back
        </Link>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Add Participants</h1>
          <p className="text-muted-foreground">
            Add email Ids of the participants.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex gap-x-2">
            <Input
              value={email}
              type="email"
              placeholder="Enter participant's email id here."
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="button" onClick={handleAddEmail}>
              <Plus className="h-4 w-4 md:mr-2" />
              <span className="pt-1 hidden md:block">Add Participant</span>
            </Button>
          </div>

          {validEmailDisplay && <Separator />}

          {validEmailDisplay && (
            <ScrollArea className="h-[8rem] md:h-auto max-h-[8rem] pr-3 w-full rounded-md">
              <div className="flex flex-col gap-y-2">
                {form.getValues().emailIds.map((emailId, index) => (
                  <div key={index} className="flex gap-x-2">
                    <Input value={emailId} type="email" disabled />
                    <Button
                      type="button"
                      onClick={() => handleDeleteEmail(index)}
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <span className="pt-1">Add Participants</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
