import path from "path";
import type { Request, Response, RequestHandler } from "express";
import { returnSeatsService, bookSeatService } from "./booking.service";

// Serves the booking page HTML.
// resolveMapper middleware already ran before this, so we know
// the movie-hall combo is valid. mapperId is on req.body if needed.
async function pageLoadingController(req: Request, res: Response) {
  try {
    const rootPath = path.join(process.cwd(), "index.html");
    res.sendFile(rootPath);
  } catch (e: any) {
    res.status(e.statusCode ?? 500).json({ error: e.message });
  }
}

// Returns booked seats + total capacity.
// mapperId comes from req.body, injected by resolveMapper middleware.
async function seatsReturnController(req: Request, res: Response) {
  try {
    const result = await returnSeatsService(req.body.mapperId);
    res.json(result);
  } catch (e: any) {
    res.status(e.statusCode ?? 500).json({ error: e.message });
  }
}

// Books a specific seat for the authenticated user.
// mapperId comes from req.body (resolveMapper), seatId from URL params.
const bookSeatController: RequestHandler<{
  movieId: string;
  hallId: string;
  seatId: string;
}> = async (
  req,
  res,
) => {
  try {
    const userInfo = req.body.info;
    await bookSeatService(req.params.seatId, req.body.mapperId, userInfo);
    res.json({ message: "Seat booked successfully" });
  } catch (e: any) {
    res.status(e.statusCode ?? 500).json({ error: e.message });
  }
};

export { pageLoadingController, seatsReturnController, bookSeatController };
