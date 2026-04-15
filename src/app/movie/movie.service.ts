import { movieHallMapper, movies, halls } from "../db/schema";
import { eq } from "drizzle-orm";
import db from "../db";
import APIError from "../../common/util/api-error";

async function movieListService() {
  const list = await db.select().from(movies);
  if (list.length === 0) return [];
  return list;
}

async function hallListService(data: string) {
  if (!data) throw APIError.BadRequest("movie id is missing");
  //I have the hallid airing the asked movie
  const airing = await db
    .select({
      id: movieHallMapper.hallId,
      name: halls.hallName,
      locaiton: halls.hallLocation,
    })
    .from(movieHallMapper)
    .innerJoin(halls, eq(movieHallMapper.hallId, halls.hallId))
    .where(eq(movieHallMapper.movieId, data));
  return airing;
}

export { movieListService, hallListService };
