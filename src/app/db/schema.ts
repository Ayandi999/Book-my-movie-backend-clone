//What are the things i need inside the auth
import {
  integer,
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  firstName: varchar("first_name", { length: 45 }).notNull(),
  lastName: varchar("last_name", { length: 45 }),

  email: varchar("email", { length: 322 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),

  password: varchar("password", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),

  refreshToken: text("refresh_token"),
});

//crreating the enum
export const validationEnum = pgEnum("validation_type", ["email", "password"]);

export const validationTable = pgTable("validations", {
  //Verification Id:
  verification_id: uuid("id").primaryKey().defaultRandom(),
  //userID
  user_id: uuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  //verification Code
  verification_code: varchar("verification_code", { length: 100 }).notNull(),
  //generated_at
  generated_at: timestamp("generated_at"), //handle logic in code
  //valid till:
  valid_till: timestamp("valid_till"),
  //Because i will reuse this for password i need another field here
  type: validationEnum("type").notNull(),
});

//========================Movie tables==========================
export const genreEnum = pgEnum("movie_genere", [
  "action",
  "commedy",
  "horror",
]);

//Describing the movies
export const movies = pgTable("movie_list", {
  movieId: uuid("movie_id").primaryKey().defaultRandom(),
  movieName: varchar("movie_name", { length: 100 }).notNull(),
  description: varchar("movie_description", { length: 250 }),
  movieGenre: genreEnum("type").notNull(),
});

//Describing the avilable halls:
export const halls = pgTable("cinema_halls", {
  hallId: uuid("hall_id").primaryKey().defaultRandom(),
  hallName: varchar("hall_name", { length: 100 }).notNull(),
  hallLocation: varchar("hall_location", { length: 300 }).notNull(),
  totalSeats: integer("total_seats").notNull(),
});

//Map the movies to the halls that are airing the movies
export const movieHallMapper = pgTable("movie_hall_mapper", {
  id: uuid("mapper_id").primaryKey().defaultRandom(),
  movieId: uuid("movie_id")
    .references(() => movies.movieId, { onDelete: "cascade" })
    .notNull(),
  hallId: uuid("hall_id")
    .references(() => halls.hallId, { onDelete: "cascade" })
    .notNull(),
});
//====================Booked Table============================
export const booked = pgTable(
  "booked_table",
  {
    //Add transaction id after payment gateway integration
    mapperId: uuid("mapper_id")
      .references(() => movieHallMapper.id, { onDelete: "cascade" })
      .notNull(),
    seatId: integer("seat_id").notNull(),
    userId: uuid("user_id").references(() => usersTable.id, {
      onDelete: "cascade",
    }),
    userName: varchar("user_name", { length: 200 }), //Just for my sake[testing part]
  },
  //Making composite key for this table
  (table) => {
    return [primaryKey({ columns: [table.mapperId, table.seatId] })];
  },
);
