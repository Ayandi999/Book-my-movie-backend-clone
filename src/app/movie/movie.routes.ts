import { Router } from "express";
import {
  movieListController,
  availableHallsContorller,
} from "./movie.controller";

const movieRouter = Router();

//return list of all vailable movies
movieRouter.get("/", movieListController);
//return list of all the halls that are screening the movie
movieRouter.get("/:id", availableHallsContorller);

//After this directly go to bookings pagek

export default movieRouter;
