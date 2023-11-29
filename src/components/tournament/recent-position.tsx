import { Triangle } from "lucide-react";

import { Trajectory } from "~/types";

interface RecentPositionProps {
  trajectory: Trajectory;
}

export const RecentPosition: React.FC<RecentPositionProps> = ({
  trajectory,
}) => {
  switch (trajectory) {
    case "up":
      return (
        <Triangle fill="#22c55e" className="h-[10px] w-[10px] text-green-500" />
      );
      break;
    case "down":
      return (
        <Triangle
          fill="red"
          className="h-[10px] w-[10px] text-[#ff0000] rotate-180"
        />
      );
      break;

    default:
      return <div className="h-[5px] w-[5px] bg-gray-500 rounded-full" />;
      break;
  }
};
