import { join } from "node:path";
import { readFile } from "fs/promises";
import express from "express";
import ragResponseMock from "../rag-response-mock.js";
import { removeStore } from "../api/index.js";

const router = express.Router();

const wait = async (duration = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
};

router.post("/test", async (req, res) => {
  // await wait(3000);

  const { stream } = req.body;
  const { userId, createdAt } = req.session;

  console.error("session", req.session);
  console.error("userId", req.session.userId);
  console.error("createdAt", req.session.createdAt);

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
    res.write(JSON.stringify({ answer: word + " " }) + chunkDelimeter);
    await wait(50);
  }

  res.end();
});

export { router as testRouter };
