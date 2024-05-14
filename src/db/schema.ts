import { relations } from "drizzle-orm";
import type { AdapterAccount } from "@auth/core/adapters";
import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  date,
  numeric,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

export const accounts = pgTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = pgTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  expires: date("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: date("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

export const users = pgTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: date("emailVerified").defaultNow(),
  image: varchar("image", { length: 255 }),
  createdAt: date("createdAt", { mode: "date" }).defaultNow(),
});

export const request = pgTable("request", {
  id: serial("id").primaryKey(),

  status: varchar("status", {
    length: 255,
    enum: ["pending", "accepted", "declined"],
  }).default("pending"),
  tournamentId: integer("tournamentId").notNull(),

  senderId: varchar("senderId", { length: 255 }).notNull(),
  receiverId: varchar("receiverId", { length: 255 }).notNull(),

  createdAt: date("createdAt", { mode: "date" }).defaultNow(),
});

export const tournament = pgTable("tournament", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  creatorId: varchar("creatorId", { length: 255 }).notNull(),

  highestWPM: numeric("highestWPM"),
  highestWPMUserId: varchar("highestWPMUserId", { length: 255 }),

  endedAt: date("endedAt", { mode: "date" }),
  winnerId: varchar("winnerId", { length: 255 }),
  createdAt: date("createdAt", { mode: "date" }).defaultNow(),
});

export const participation = pgTable("participation", {
  id: serial("id").primaryKey(),

  userId: varchar("userId", { length: 255 }).notNull(),
  tournamentId: integer("tournamentId").notNull(),

  createdAt: date("createdAt", { mode: "date" }).defaultNow(),
});

export const round = pgTable("round", {
  id: serial("id").primaryKey(),

  winnerId: varchar("winnerId", { length: 255 }),
  tournamentId: integer("tournamentId").notNull(),
  draw: boolean("draw").default(false),

  createdAt: date("createdAt", { mode: "date" }).defaultNow(),
});

export const score = pgTable("score", {
  id: serial("id").primaryKey(),

  point: integer("score").notNull(),
  average: numeric("average").notNull(),
  participationId: integer("participationId").notNull(),
  roundId: integer("roundId").notNull(),

  createdAt: date("createdAt", { mode: "date" }).defaultNow(),
});

// --------------------------------RELATIONS--------------------------------------//

// users <-> participations
export const participationRelation = relations(participation, ({ one }) => ({
  user: one(users, {
    fields: [participation.userId],
    references: [users.id],
  }),
}));

export const UserParticipantsRelations = relations(users, ({ many }) => ({
  participants: many(participation),
}));

// users (winner) <-> tournament
// users (creator) <-> tournament
// users (recordHolder) <-> tournament
export const tournamentRelation = relations(tournament, ({ one }) => ({
  winner: one(users, {
    fields: [tournament.winnerId],
    references: [users.id],
    relationName: "winnerRelation",
  }),
  creator: one(users, {
    fields: [tournament.creatorId],
    references: [users.id],
    relationName: "creatorRelation",
  }),
  recordHolder: one(users, {
    fields: [tournament.highestWPMUserId],
    references: [users.id],
    relationName: "recordHolderRelation",
  }),
}));

export const UserTournamentsRelations = relations(users, ({ many }) => ({
  trophies: many(tournament, { relationName: "winnerRelation" }),
}));

export const UserTournamentCreatorRelations = relations(users, ({ many }) => ({
  tournamentCreated: many(tournament, {
    relationName: "creatorRelation",
  }),
}));

export const UserTournamentRecordHolderRelations = relations(
  users,
  ({ many }) => ({
    tournamentCreated: many(tournament, {
      relationName: "recordHolderRelation",
    }),
  })
);

// tournament <-> participation
export const tournamentParticipationRelation = relations(
  participation,
  ({ one }) => ({
    tournament: one(tournament, {
      fields: [participation.tournamentId],
      references: [tournament.id],
    }),
  })
);

export const tournamentParticipationRelations = relations(
  tournament,
  ({ many }) => ({
    participants: many(participation),
  })
);

// tournament <-> round
export const tournamentRoundRelation = relations(round, ({ one }) => ({
  tournament: one(tournament, {
    fields: [round.tournamentId],
    references: [tournament.id],
  }),
}));

export const tournamentRoundRelations = relations(tournament, ({ many }) => ({
  rounds: many(round),
}));

// round <-> score
export const roundScoreRelation = relations(score, ({ one }) => ({
  round: one(round, {
    fields: [score.roundId],
    references: [round.id],
  }),
}));

export const roundScoreRelations = relations(round, ({ many }) => ({
  scores: many(score),
}));

// participation <-> score
export const participationScoreRelation = relations(score, ({ one }) => ({
  participant: one(participation, {
    fields: [score.participationId],
    references: [participation.userId],
  }),
}));

export const participationScoreRelations = relations(
  participation,
  ({ many }) => ({
    scores: many(score),
  })
);

// participation <-> round
export const participationRoundRelation = relations(round, ({ one }) => ({
  winner: one(participation, {
    fields: [round.winnerId],
    references: [participation.userId],
  }),
}));

export const ParticipationRoundsRelations = relations(
  participation,
  ({ many }) => ({
    wins: many(round),
  })
);

//request <-> user (sender)
//request <-> user (receiver)
export const senderRequestRelation = relations(request, ({ one }) => ({
  sender: one(users, {
    fields: [request.senderId],
    references: [users.id],
    relationName: "senderRelation",
  }),
  receiver: one(users, {
    fields: [request.receiverId],
    references: [users.id],
    relationName: "receiverRelation",
  }),
}));

//request <-> tournament
export const tournamentRequestRelation = relations(request, ({ one }) => ({
  tournament: one(tournament, {
    fields: [request.tournamentId],
    references: [tournament.id],
  }),
}));

export const TournamentRequestRelations = relations(tournament, ({ many }) => ({
  requests: many(request),
}));

// --------------------------------TYPES--------------------------------------//
export type User = typeof users.$inferSelect;
export type Tournament = typeof tournament.$inferSelect;
export type Participation = typeof participation.$inferSelect;
export type Round = typeof round.$inferSelect;
export type Score = typeof score.$inferSelect;
export type Request = typeof request.$inferSelect;
