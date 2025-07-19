CREATE TABLE `points` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kabupaten` text NOT NULL,
	`province` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`boolean` integer DEFAULT 0
);
