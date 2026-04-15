import { Router } from "express";
import {
  bookSeatController,
  pageLoadingController,
  seatsReturnController,
} from "./booking.controller";
import { validateToken } from "./middleware/verifyToken";
import resolveMapper from "./middleware/resolveMapper";

const bookingRouter = Router();

// resolveMapper runs first on every route:
// it reads :movieId + :hallId, finds the mapper record,
// and attaches mapperId to req.body for downstream use.

// Serves the booking page (also validates the movie-hall combo exists)
bookingRouter.get("/:movieId/:hallId", resolveMapper, pageLoadingController);

// Returns booked seats + total capacity for this show
//This one is supposed to be called internally from index.html
bookingRouter.get(
  "/:movieId/:hallId/seats",
  resolveMapper,
  seatsReturnController,
);

// Books a specific seat — auth required
bookingRouter.put(
  "/:movieId/:hallId/:seatId",
  resolveMapper,
  validateToken,
  bookSeatController,
);

export default bookingRouter;
