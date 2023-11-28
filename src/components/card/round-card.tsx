import UserAvatar from "~/components/avatar";
import { useRoundDetails } from "~/hooks/useRoundDetails";
import { ExtendedParticipantType, ExtendedRound } from "~/types";
import { getCustomizedUserName, getFormattedDate } from "~/lib/utils";
import { CustomToolTip } from "../ui/custom-tooltip";

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
      <p className="text-muted-foreground text-xs text-center">
        No score was found.
      </p>
    );
  }

  return (
    <div className="p-2 space-y-3 w-full">
      <div className="flex gap-x-2">
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
          <div className="h-6 flex items-center text-xs px-2 justify-center rounded-md bg-primary text-white">
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
