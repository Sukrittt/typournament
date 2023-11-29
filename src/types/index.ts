import {
  Participation,
  Request,
  Score,
  Tournament,
  User,
  Round,
} from "~/db/schema";

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

export interface AnnouncementRoundFlow extends RoundFlow {
  title: string;
  winner?: User | null;
  loser?: User | null;
}

export type ExtendedRound = {
  round: Round;
  score: Score[];
};

export type RoundStatus = "win" | "loss" | "draw" | "nan";
export type Trajectory = "up" | "down" | "same";
