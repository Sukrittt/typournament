import { Participation, Tournament } from "~/db/schema";

export type League = {
  participation: Participation;
  tournament: Tournament;
};
