import { Participation, Request, Tournament, User } from "~/db/schema";

export type League = {
  participation: Participation;
  tournament: Tournament;
};

export type ExtendedRequest = {
  tournament: Tournament | null;
  requests: {
    request: Request;
    sender: User;
  }[];
};
