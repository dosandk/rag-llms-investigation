import express from "express";
import cors from "cors";
import session from "express-session";

import { testRouter } from "./routes/test.js";
import { ragRouter } from "./routes/rag.js";
import { uploadRouter } from "./routes/upload.js";
import userSession from "./middlewares/user-session.js";

const app = express();

app.set("trust proxy", true);
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 15, // would expire after 15 minutes
    },
    secret: "<my_super_secret>",
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
app.use("/api", ragRouter);
app.use("/api", uploadRouter);

app.all("*", async () => {
  throw new Error("Not found");
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
});

export default app;
