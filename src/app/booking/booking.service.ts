import APIError from "../../common/util/api-error";
import db from "../db";
import { booked, movieHallMapper, usersTable, halls, movies } from "../db/schema";
import { and, eq } from "drizzle-orm";

// Returns all booked seat IDs + total capacity for a given show
const returnSeatsService = async (mapperId: string) => {
  //Update this code
  //Here i am to send back an array containing booked seat numbers
  //and a number telling the total seats available
  //Above 2 are returned inside an object.

  //const result = await pool.query("select * from seats");
  const bookedSeats = await db
    .select({ seatId: booked.seatId })
    .from(booked)
    .where(eq(booked.mapperId, mapperId));
  //I do need the hall id from mapper table
  const [showInfo] = await db
    .select({
      totalSeats: halls.totalSeats,
      hallName: halls.hallName,
      movieName: movies.movieName,
    })
    .from(movieHallMapper)
    .innerJoin(halls, eq(movieHallMapper.hallId, halls.hallId))
    .innerJoin(movies, eq(movieHallMapper.movieId, movies.movieId))
    .where(eq(movieHallMapper.id, mapperId));

  return {
    booked: bookedSeats,
    total: showInfo?.totalSeats,
    movieName: showInfo?.movieName,
    hallName: showInfo?.hallName,
  };
};

type userType = {
  userId: string;
  iat: number;
  exp: number;
};

async function bookSeatService(
  seatId: string,
  mapperId: string,
  user: userType,
) {
  // Verify the user exists
  const [userInfo] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, user.userId));
  if (!userInfo) throw APIError.BadRequest("Create an account first");

  await db.transaction(async (tx) => {
    // Lock check: is this seat already taken for this show?
    const existingSeat = await tx
      .select()
      .from(booked)
      .where(
        and(
          eq(booked.mapperId, mapperId),
          eq(booked.seatId, parseInt(seatId)),
        ),
      );

    if (existingSeat.length !== 0)
      throw APIError.seatBookingError("Seat is already booked");

    // Insert the booking with user details
    await tx.insert(booked).values({
      mapperId,
      seatId: parseInt(seatId),
      userId: userInfo.id,
      userName: `${userInfo.firstName} ${userInfo.lastName ?? ""}`,
    });
  });
}

// Finds the mapper record for a given movie-hall pair.
// Called by resolveMapper middleware — not by controllers directly.
async function mapperFinderService(movieId: string, hallId: string) {
  const [mapper] = await db
    .select()
    .from(movieHallMapper)
    .where(
      and(
        eq(movieHallMapper.movieId, movieId),
        eq(movieHallMapper.hallId, hallId),
      ),
    );
  if (!mapper)
    throw APIError.BadRequest(
      "This movie is not currently airing in this hall",
    );
  return mapper;
}
export { mapperFinderService, returnSeatsService, bookSeatService };
