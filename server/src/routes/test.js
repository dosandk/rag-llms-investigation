import express from "express";
import ragResponseMock from "../rag-response-mock.js";

const router = express.Router();

const wait = async (duration = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
};

router.post("/test", async (req, res) => {
  // await wait(3000);

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
    res.write(JSON.stringify({ answer: word + " " }) + chunkDelimeter);
    await wait(50);
  }

  res.end();
});

export { router as testRouter };
