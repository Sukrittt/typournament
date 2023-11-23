import {
  int,
  timestamp,
  mysqlTable,
  primaryKey,
  varchar,
  serial,
  text,
  float,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import type { AdapterAccount } from "@auth/core/adapters";

export const accounts = mysqlTable(
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
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).defaultNow(),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const tournament = mysqlTable("tournament", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),

  highestWPM: float("highestWPM").default(0),
  endedAt: timestamp("endedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const participation = mysqlTable("participation", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),

  average: float("average").default(0),
  userId: varchar("userId", { length: 255 }).notNull(),
  tournamentId: int("tournamentId").notNull(),

  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const score = mysqlTable("score", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),

  score: float("score").notNull(),
  participationId: varchar("participationId", { length: 255 }),
  tournamentId: int("tournamentId").notNull(),

  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const round = mysqlTable("round", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),

  average: float("average").default(0),
  winnerId: varchar("userId", { length: 255 }),
  tournamentId: int("tournamentId").notNull(),
  draw: boolean("draw").default(false),

  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

// --------------------------------RELATIONS--------------------------------------//

// users <-> rounds
export const roundsRelation = relations(round, ({ one }) => ({
  author: one(users, {
    fields: [round.winnerId],
    references: [users.id],
  }),
}));

export const UserRoundsRelations = relations(users, ({ many }) => ({
  rounds: many(round),
}));

// users <-> participations
export const participationRelation = relations(participation, ({ one }) => ({
  author: one(users, {
    fields: [participation.userId],
    references: [users.id],
  }),
}));

export const UserParticipantsRelations = relations(users, ({ many }) => ({
  participants: many(participation),
}));

// tournament <-> participation
export const tournamentParticipationRelation = relations(
  participation,
  ({ one }) => ({
    author: one(tournament, {
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
  author: one(tournament, {
    fields: [round.tournamentId],
    references: [tournament.id],
  }),
}));

export const tournamentRoundRelations = relations(tournament, ({ many }) => ({
  rounds: many(round),
}));

// tournament <-> score
export const tournamentScoreRelation = relations(score, ({ one }) => ({
  author: one(tournament, {
    fields: [score.tournamentId],
    references: [tournament.id],
  }),
}));

export const tournamentScoreRelations = relations(tournament, ({ many }) => ({
  scores: many(score),
}));

// participation <-> score
export const participationScoreRelation = relations(score, ({ one }) => ({
  author: one(participation, {
    fields: [score.participationId],
    references: [participation.id],
  }),
}));

export const participationScoreRelations = relations(
  participation,
  ({ many }) => ({
    scores: many(score),
  })
);

// --------------------------------TYPES--------------------------------------//
export type User = typeof users.$inferSelect;
export type Tournament = typeof tournament.$inferSelect;
export type Participation = typeof participation.$inferSelect;
export type Round = typeof round.$inferSelect;
export type Score = typeof score.$inferSelect;
