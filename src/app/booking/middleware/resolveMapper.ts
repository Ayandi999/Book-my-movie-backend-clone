import type { RequestHandler } from "express";
import { mapperFinderService } from "../booking.service";

// Resolves the movieHallMapper record from URL params and attaches the
// mapperId to req.body so every downstream controller/service can use it
// without needing it passed in manually.
const resolveMapper: RequestHandler<{
  movieId: string;
  hallId: string;
}> = async (req, res, next) => {
  try {
    const { movieId, hallId } = req.params;
    const mapper = await mapperFinderService(movieId, hallId);
    //Add mapper id to the request body
    req.body = req.body ?? {}; // GET requests have no body — initialize if undefined
    req.body.mapperId = mapper.id;
    next();
  } catch (e: any) {
    res.status(e.statusCode ?? 500).json({ error: e.message });
  }
};
export default resolveMapper;
