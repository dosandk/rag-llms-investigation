import express from "express";
import cors from "cors";

import { testRouter } from "./routes/test.js";
import { ragRouter } from "./routes/rag.js";

const app = express();

app.set("trust proxy", true);
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", testRouter);
app.use("/api", ragRouter);

app.all("*", async () => {
  throw new Error("Not found");
});

export default app;
