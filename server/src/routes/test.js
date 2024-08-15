import { join } from "node:path";
import { readFile } from "fs/promises";
import express from "express";
import ragResponseMock from "../rag-response-mock.js";

const router = express.Router();

const wait = async (duration = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
};

const RAG_CORE_URL = process.env.RAG_CORE_URL;

if (!RAG_CORE_URL) {
  throw new Error("RAG_CORE_URL must be defined");
}

router.post("/create-store", async (req, res) => {
  const { userId } = req.session;
  const filePath = join(import.meta.dirname, "./test-doc.md");
  const fileContent = await readFile(filePath, "utf8");

  console.error("fileContent", fileContent);
  console.error("userId", userId);

  const response = await fetch(RAG_CORE_URL + "/create-store", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: fileContent,
      // TODO: replace it
      userId: "foo",
    }),
  });

  const json = await response.json();

  console.log("json", json);

  res.json({ ok: "ok" });
});

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
