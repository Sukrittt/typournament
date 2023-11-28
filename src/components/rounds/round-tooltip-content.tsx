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
  const roundDetails = useRoundDetails({ participants, round });

  if (!roundDetails.participantOne || !roundDetails.participantTwo) {
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
        {getFormattedDate(roundDetails.round.createdAt, "EEEE dd MMMM yyyy")}
      </p>

      <div className="flex gap-x-2">
        <div className="flex items-center gap-x-2">
          <p>
            {getCustomizedUserName({
              username: roundDetails.participantOne.user.name,
              type: "shortname",
            })}
          </p>
          <UserAvatar
            user={roundDetails.participantOne.user}
            className="h-6 w-6"
          />
        </div>

        <div className="h-6 flex items-center text-xs px-2 justify-center rounded-md bg-primary text-white">
          {roundDetails.participantOneScore} -{" "}
          {roundDetails.participantTwoScore}
        </div>

        <div className="flex items-center gap-x-2">
          <p>
            {getCustomizedUserName({
              username: roundDetails.participantTwo.user.name,
              type: "shortname",
            })}
          </p>
          <UserAvatar
            user={roundDetails.participantTwo.user}
            className="h-6 w-6"
          />
        </div>
      </div>
    </div>
  );
};
