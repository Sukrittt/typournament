"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Tournament } from "~/db/schema";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "~/components/ui/input";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  UpdateTournamentValidator,
  updateTournamentSchema,
} from "~/lib/validators";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";
import { siteConfig } from "~/config";
import { DeleteTournamentDialog } from "~/components/tournament/delete-tournament-dialog";

export const ManageTournamentForm = ({
  tournament,
}: {
  tournament: Tournament;
}) => {
  const router = useRouter();

  const form = useForm<UpdateTournamentValidator>({
    resolver: zodResolver(updateTournamentSchema),
    defaultValues: {
      name: tournament.name,
      tournamentId: tournament.id,
    },
  });

  const { mutate: createTournament, isLoading } =
    trpc.tournament.updateTournament.useMutation({
      onSuccess: () => {
        toast.success("Tournament updated successfully.");
        form.reset();
        router.push(`/t/${tournament.id}`);
      },
    });

  function onSubmit(content: UpdateTournamentValidator) {
    if (content.name === tournament.name) {
      toast.error("Please change the name of the tournament.");
      return;
    }

    createTournament(content);
  }

  return (
    <div className="h-screen flex flex-col justify-center w-full max-w-md space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Link
            href={`/t/${tournament.id}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-white w-fit pl-0"
            )}
          >
            Go Back
          </Link>
          <DeleteTournamentDialog tournamentId={tournament.id} />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Manage your {siteConfig.name}</h1>
          <p className="text-muted-foreground">Manage your tournament here.</p>
        </div>
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <span className="pt-1">Rename</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
