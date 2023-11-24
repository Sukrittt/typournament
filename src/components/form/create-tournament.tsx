"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus, Trash2 } from "lucide-react";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  CreateTournamentValidator,
  createTournamentSchema,
} from "~/lib/validators";
import { trpc } from "~/trpc/client";
import { Separator } from "~/components/ui/separator";

export const CreateTournament = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const form = useForm<CreateTournamentValidator>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      name: "",
      emailIds: undefined,
    },
  });

  const { mutate: createTournament, isLoading } =
    trpc.tournament.createTournament.useMutation({
      onSuccess: ({ tournamentId }) => {
        toast.success("Tournament created successfully.");
        form.reset();
        router.push(`/t/${tournamentId}`);
      },
      onError: () => {
        toast.error("Something went wrong.");
      },
    });

  const isValidEmail = (emailId: string) => {
    try {
      createTournamentSchema.parse({ emailIds: [emailId], name: "email" });
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

  function onSubmit(content: CreateTournamentValidator) {
    createTournament(content);
  }

  return (
    <div className="h-screen flex flex-col justify-center mx-auto max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create a Tournament</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new tournament
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tournament Name</FormLabel>
                <FormControl>
                  <Input placeholder="Type tournament name here." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-x-2">
            <Input
              value={email}
              type="email"
              placeholder="Enter participant's email id here."
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="button" onClick={handleAddEmail}>
              <Plus className="h-4 w-4 mr-2" /> Add Participant
            </Button>
          </div>

          {validEmailDisplay && <Separator />}

          {validEmailDisplay && (
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
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
