import { AddParticipantsForm } from "~/components/form/add-participants-form";

interface TournamentAddParticipantsPageProps {
  params: {
    tournamentId: string;
  };
}

const AddParticipants = (params: TournamentAddParticipantsPageProps) => {
  const { tournamentId: rawTournamentId } = params.params;
  const tournamentId = parseInt(rawTournamentId);

  return <AddParticipantsForm tournamentId={tournamentId} />;
};

export default AddParticipants;
