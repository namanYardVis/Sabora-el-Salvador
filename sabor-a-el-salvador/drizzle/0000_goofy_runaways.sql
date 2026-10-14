CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`request_key` text NOT NULL,
	`created_at` text NOT NULL,
	`phone` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'Nuevo' NOT NULL,
	`notified` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_request_key_unique` ON `orders` (`request_key`);