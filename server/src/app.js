import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import rateLimit from "express-rate-limit";

import { testRouter } from "./routes/test.js";
import { storeRouter } from "./routes/store.js";
import { ragRouter } from "./routes/rag.js";
import { uploadRouter } from "./routes/upload.js";
import userSession from "./middlewares/user-session.js";

const app = express();

app.set("trust proxy", 2);

app.use(
  cookieSession({
    signed: false,
    // disable secure cookies (transmitted only over https) for test environment
    secure: process.env.NODE_ENV === "production",
  }),
);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://ai.bootcamp.place"
        : true,
    credentials: true,
  }),
);

const WINDOW_MS = 15 * 60 * 1000; // 15 mins

app.use(
  rateLimit({
    windowMs: WINDOW_MS,
    max: 20, // max calls from one IP address
    message: {
      error: `Too many requests, please try again after ${WINDOW_MS / (60 * 1000)} mins`,
    },
  }),
);

app.disable("x-powered-by");
app.use(express.json());

app.use(userSession);
app.use("/api", testRouter);
app.use("/api", storeRouter);
app.use("/api", ragRouter);
app.use("/api", uploadRouter);

app.all("*", async () => {
  throw new Error("Not found");
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
});

export default app;
