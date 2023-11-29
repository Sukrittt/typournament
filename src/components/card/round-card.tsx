import UserAvatar from "~/components/avatar";
import { useRoundDetails } from "~/hooks/useRoundDetails";
import { CustomToolTip } from "~/components/ui/custom-tooltip";
import { ExtendedParticipantType, ExtendedRound } from "~/types";
import { getCustomizedUserName, getFormattedDate } from "~/lib/utils";
import { Info } from "lucide-react";

interface PreviousRoundResultProps {
  round: ExtendedRound;
  participants: ExtendedParticipantType[];
}

export const RoundCard: React.FC<PreviousRoundResultProps> = ({
  round,
  participants,
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
      <div className="text-muted-foreground flex items-center gap-x-1 justify-center">
        <p className="text-xs text-center pt-px">
          No score was found for this round.
        </p>
        <CustomToolTip
          content={
            <p className="text-xs text-muted-foreground">
              The participant(s) was removed from the tournament for a moment.
            </p>
          }
        >
          <Info className="h-3 w-3" />
        </CustomToolTip>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-3 w-full">
      <div className="flex gap-x-2 justify-around">
        <div className="flex items-center gap-x-2">
          <p>
            {getCustomizedUserName({
              username: participantOne.user.name,
            })}
          </p>
          <UserAvatar user={participantOne.user} className="h-6 w-6" />
        </div>

        <CustomToolTip
          content={
            <p className="text-xs text-muted-foreground text-center">
              {getFormattedDate(roundDetails.createdAt, "EEEE dd MMMM yyyy")}
            </p>
          }
        >
          <div className="h-6 w-24 flex items-center text-xs px-2 justify-center rounded-md bg-zinc-800 text-white">
            {participantOneScore} - {participantTwoScore}
          </div>
        </CustomToolTip>

        <div className="flex items-center gap-x-2">
          <UserAvatar user={participantTwo.user} className="h-6 w-6" />
          <p>
            {getCustomizedUserName({
              username: participantTwo.user.name,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
