CREATE TABLE "booked_table" (
	"mapper_id" uuid NOT NULL,
	"seat_id" integer NOT NULL,
	"user_id" uuid,
	"user_name" varchar(200),
	CONSTRAINT "booked_table_mapper_id_seat_id_pk" PRIMARY KEY("mapper_id","seat_id")
);
--> statement-breakpoint
ALTER TABLE "cinema_halls" ADD COLUMN "total_seats" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "movie_hall_mapper" ADD COLUMN "mapper_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "booked_table" ADD CONSTRAINT "booked_table_mapper_id_movie_hall_mapper_mapper_id_fk" FOREIGN KEY ("mapper_id") REFERENCES "public"."movie_hall_mapper"("mapper_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booked_table" ADD CONSTRAINT "booked_table_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;