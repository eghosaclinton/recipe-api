ALTER TABLE "users" ADD COLUMN "userName" varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_userName_unique" UNIQUE("userName");