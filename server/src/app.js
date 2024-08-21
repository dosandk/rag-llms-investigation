import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";

import { testRouter } from "./routes/test.js";
import { storeRouter } from "./routes/store.js";
import { ragRouter } from "./routes/rag.js";
import { uploadRouter } from "./routes/upload.js";
import userSession from "./middlewares/user-session.js";

const app = express();

app.set("trust proxy", true);

app.use(
  cookieSession({
    signed: false,
    // disable secure cookies (transmitted only over https) for test environment
    secure: process.env.NODE_ENV === "production",
  }),
);
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
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
