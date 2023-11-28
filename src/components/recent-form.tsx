import { FC } from "react";

import { CustomToolTip } from "~/components/ui/custom-tooltip";
import { ExtendedParticipantType, ExtendedRound, RoundStatus } from "~/types";
import { RoundToolTipContent } from "~/components/rounds/round-tooltip-content";

type ExtendedRoundWithStatus = ExtendedRound & { status: RoundStatus };

interface RecentFormProps {
  round: ExtendedRoundWithStatus;
  participants: ExtendedParticipantType[];
}

export const RecentForm: FC<RecentFormProps> = ({ round, participants }) => {
  switch (round.status) {
    case "win":
      return (
        <CustomToolTip
          content={
            <RoundToolTipContent participants={participants} round={round} />
          }
        >
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500 text-white text-xs border border-green-500">
            <span className="pt-px">W</span>
          </div>
        </CustomToolTip>
      );
      break;
    case "loss":
      return (
        <CustomToolTip
          content={
            <RoundToolTipContent participants={participants} round={round} />
          }
        >
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-600 text-white text-xs border border-red-500">
            <span className="pt-px">L</span>
          </div>
        </CustomToolTip>
      );
      break;
    case "draw":
      return (
        <CustomToolTip
          content={
            <RoundToolTipContent participants={participants} round={round} />
          }
        >
          <div className="flex items-center justify-center h-6 w-6 rounded-full text-xs bg-yellow-600 border-yellow-600 text-white">
            <span className="pt-px">D</span>
          </div>
        </CustomToolTip>
      );
      break;
    case "nan":
      return (
        <div className="flex items-center justify-center h-6 w-6 rounded-full text-xs bg-zinc-800 text-white">
          -
        </div>
      );
      break;

    default:
      return (
        <div className="flex items-center justify-center h-6 w-6 rounded-full text-xs bg-zinc-800 text-white">
          <span className="pt-px">?</span>
        </div>
      );
      break;
  }
};
