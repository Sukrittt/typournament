import UserAvatar from "~/components/avatar";
import { useRoundDetails } from "~/hooks/useRoundDetails";
import { ExtendedParticipantType, ExtendedRound } from "~/types";
import { getCustomizedUserName, getFormattedDate } from "~/lib/utils";

interface RoundToolTipContentProps {
  round: ExtendedRound;
  participants: ExtendedParticipantType[];
}

export const RoundToolTipContent: React.FC<RoundToolTipContentProps> = ({
  participants,
  round,
}) => {
  const {
    participantOne,
    participantOneScore,
    participantTwo,
    participantTwoScore,
    round: roundDetails,
  } = useRoundDetails({ participants, round });

  if (!participantOne || !participantTwo) {
    return (
      <p className="text-muted-foreground text-xs text-center">
        No score was found.
      </p>
    );
  }

  return (
    <div className="p-2 space-y-3">
      <p className="text-muted-foreground text-center">
        {" "}
        {getFormattedDate(roundDetails.createdAt, "EEEE dd MMMM yyyy")}
      </p>

      <div className="flex gap-x-2">
        <div className="flex items-center gap-x-2">
          <p>
            {getCustomizedUserName({
              username: participantOne.user.name,
              type: "shortname",
            })}
          </p>
          <UserAvatar user={participantOne.user} className="h-6 w-6" />
        </div>

        <div className="h-6 flex items-center text-xs px-2 justify-center rounded-md bg-zinc-800 text-white">
          {participantOneScore} - {participantTwoScore}
        </div>

        <div className="flex items-center gap-x-2">
          <UserAvatar user={participantTwo.user} className="h-6 w-6" />
          <p>
            {getCustomizedUserName({
              username: participantTwo.user.name,
              type: "shortname",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
