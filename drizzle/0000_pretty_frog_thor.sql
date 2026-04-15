CREATE TYPE "public"."movie_genere" AS ENUM('action', 'commedy', 'horror');--> statement-breakpoint
CREATE TYPE "public"."validation_type" AS ENUM('email', 'password');--> statement-breakpoint
CREATE TABLE "cinema_halls" (
	"hall_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hall_name" varchar(100) NOT NULL,
	"hall_location" varchar(300) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movie_hall_mapper" (
	"movie_id" uuid NOT NULL,
	"hall_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movie_list" (
	"movie_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"movie_name" varchar(100) NOT NULL,
	"movie_description" varchar(250),
	"type" "movie_genere" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(45) NOT NULL,
	"last_name" varchar(45),
	"email" varchar(322) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"password" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"refresh_token" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "validations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"verification_code" varchar(100) NOT NULL,
	"generated_at" timestamp,
	"valid_till" timestamp,
	"type" "validation_type" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "movie_hall_mapper" ADD CONSTRAINT "movie_hall_mapper_movie_id_movie_list_movie_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movie_list"("movie_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_hall_mapper" ADD CONSTRAINT "movie_hall_mapper_hall_id_cinema_halls_hall_id_fk" FOREIGN KEY ("hall_id") REFERENCES "public"."cinema_halls"("hall_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "validations" ADD CONSTRAINT "validations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;