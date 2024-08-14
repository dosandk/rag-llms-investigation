import express from "express";
import cors from "cors";

import { HumanMessage, AIMessage } from "@langchain/core/messages";

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

    console.error("Result", result);

    chatHistory.push(new HumanMessage(question));
    chatHistory.push(new AIMessage(result.answer));

    res.status(200).json(result);
  });

  app.post("/chat-with-stream", async (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const { question } = req.body;

    try {
      console.log("question:", question);

      const answerData = [];
      const stream = await ragChain.stream({
        input: question,
        chat_history: chat_history,
      });

      const chunkDelimeter = "\n\t\t\t\n";

      for await (const chunk of stream) {
        console.log("chunk", chunk);

        res.write(JSON.stringify(chunk) + chunkDelimeter);

        if (chunk.answer) {
          answerData.push(chunk.answer);
        }
      }

      // TODO: make chat histoy stateless and keep it only inside requests...
      chat_history.push(new HumanMessage(question));
      chat_history.push(new AIMessage(answerData.join("")));
      res.end();
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
      res.end();
    }
  });

  app.all("*", async () => {
    throw new Error("Not found");
  });

  return app;
};

export default initApp;
