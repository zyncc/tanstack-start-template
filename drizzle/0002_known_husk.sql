CREATE TABLE "todo" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"date" timestamp NOT NULL,
	"completed" boolean DEFAULT false,
	"created_at" timestamp,
	"updated_at" timestamp
);
