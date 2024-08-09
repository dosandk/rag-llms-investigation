import express from "express";
import cors from "cors";

import { HumanMessage, AIMessage } from "@langchain/core/messages";
import ragResponseMock from "./rag-response-mock.js"

const wait = async (duration = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
};

// TODO: manage history size
const chat_history = [];

const initApp = (ragChain) => {
  const app = express();

  app.set("trust proxy", true);
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());

  // NOTE: store history for "chat" endpoint in the separate variable
  const chatHistory = [];

  app.post("/chat", async (req, res) => {
    const { question } = req.body;

    console.log("question", question);

    const result = await ragChain.invoke({
      chat_history: chatHistory,
      input: question,
    });

    chatHistory.push(new HumanMessage(question));
    chatHistory.push(new AIMessage(result.answer));

    res.status(200).json(result);
  });

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

    res.write(JSON.stringify({ history: chat_history}) + chunkDelimeter);
    res.write(JSON.stringify({ input }) + chunkDelimeter);
    res.write(JSON.stringify({ context }) + chunkDelimeter);

    const answerArr = answer.split(" ");

    for (const word of answerArr) {
      res.write(JSON.stringify({ answer: word }) + chunkDelimeter);
    }

    res.end();
  });

  app.post("/chat-with-stream", async (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const { question } = req.body;

    console.log("question:", question);

    const answerData = [];
    const stream = await ragChain.stream({ input: question, chat_history: chat_history });

    const chunkDelimeter = "\n\t\t\t\n";

    for await (const chunk of stream) {
      console.log("chunk", chunk);

      res.write(JSON.stringify(chunk) + chunkDelimeter);

      if (chunk.answer) {
        answerData.push(chunk.answer);
      }
    }

    chat_history.push(new HumanMessage(question));
    chat_history.push(new AIMessage(answerData.join("")));
    res.end();
  });

  app.all("*", async () => {
    throw new Error("Not found");
  });

  return app;
};

export default initApp;
