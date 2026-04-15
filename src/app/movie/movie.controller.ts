import type { Request, Response } from "express";
import { movieListService, hallListService } from "./movie.service";

const movieListController = async (_: Request, res: Response) => {
  const movieList = await movieListService();
  res.send(movieList);
};

const availableHallsContorller = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const hallList = await hallListService(req.params.id);
    res.send(hallList);
  } catch (e: any) {
    res.status(e.statusCode).json({ message: e.message });
  }
};

export { movieListController, availableHallsContorller };
