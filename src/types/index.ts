import { Participation, Request, Score, Tournament, User } from "~/db/schema";

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

export type ExtendedParticipantType = {
  user: User;
  participation: Participation;
  scores: Score[];
};

export type RoundFlow = {
  onBackStep?: () => void;
  onNextStep?: () => void;
};
