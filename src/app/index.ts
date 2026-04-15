import express from "express";
import authRouter from "./auth/auth.routes";
import movieRouter from "./movie/movie.routes";
import bookingRouter from "./booking/booking.routes";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/movies", movieRouter);
app.use("/api/booking", bookingRouter);

export default app;
