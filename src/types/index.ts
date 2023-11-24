import { Participation, Request, Tournament, User } from "~/db/schema";

export type League = {
  user: User;
  tournament: Tournament;
  participantCount: number;
  participation: Participation;
};

export type ExtendedRequest = {
  tournament: Tournament | null;
  requests: {
    request: Request;
    sender: User;
  }[];
};
