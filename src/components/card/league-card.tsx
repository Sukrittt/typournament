import { League } from "~/types";

export const LeagueCard = ({ league }: { league: League }) => {
  return <p>{league.tournament.name}</p>;
};
