CREATE TABLE `account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `participation` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(255) NOT NULL,
	`tournamentId` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `participation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `request` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`status` varchar(255) DEFAULT 'pending',
	`tournamentId` int NOT NULL,
	`senderId` varchar(255) NOT NULL,
	`receiverId` varchar(255) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `request_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `round` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`winnerId` varchar(255),
	`tournamentId` int NOT NULL,
	`draw` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `round_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `score` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`score` int NOT NULL,
	`average` float NOT NULL,
	`participationId` varchar(255),
	`roundId` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `score_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `tournament` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`creatorId` varchar(255) NOT NULL,
	`highestWPM` float,
	`endedAt` timestamp,
	`winnerId` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `tournament_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3) DEFAULT (now()),
	`image` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
