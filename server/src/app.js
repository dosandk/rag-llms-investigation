import express from "express";
import cors from "cors";

import ragResponseMock from "./rag-response-mock.js";

// const wait = async (duration = 0) => {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(), duration);
//   });
// };

const app = express();

app.set("trust proxy", true);
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

app.post("/test", async (req, res) => {
  const { stream } = req.body;

  if (stream === false) {
    res.status(200).json(ragResponseMock);
    return;
  }

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  const { chat_history, input, context, answer } = ragResponseMock;
  const chunkDelimeter = "\n\t\t\t\n";

  res.write(JSON.stringify({ history: chat_history }) + chunkDelimeter);
  res.write(JSON.stringify({ input }) + chunkDelimeter);
  res.write(JSON.stringify({ context }) + chunkDelimeter);

  const answerArr = answer.split(" ");

  for (const word of answerArr) {
    res.write(JSON.stringify({ answer: word }) + chunkDelimeter);
  }

  res.end();
});

// TODO: call API method from rag-core

app.all("*", async () => {
  throw new Error("Not found");
});

export default app;
