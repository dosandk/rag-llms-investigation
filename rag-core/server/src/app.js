import express from "express";
import cors from "cors";

import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { db } from "../../db/memory-db.js";
import getRagChain from "../../langchain/index.js";
import { loadDocs } from "../../utils/load-docs.js";
import { embeddings } from "../../llm/index.js";
import { Document } from "@langchain/core/documents";

const chat_history = [];

const initApp = (mainVectorStore) => {
  const app = express();

  app.set("trust proxy", true);
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());

  // TODO: implement service for stores clearing
  const stores = {
    // userId: { expDate: "", vectoreStore: {} }
  };

  app.post("/create-store", async (req, res) => {
    const { userId, content } = req.body;

    console.error("userId", userId);

    // TODO: store data in "stores" variable
    const docs = await loadDocs();
    const newDoc = new Document({
      pageContent: content,
      metadata: {
        // ...metadata,
      },
    });

    docs.push(newDoc);

    console.log("docs", typeof docs, docs);

    const vectorStore = await db.createVectorStore({
      embeddings,
      docs,
    });

    stores[userId] = vectorStore;

    res.json({ ok: "store was created" });
  });

  app.post("/chat", async (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const { question, userId } = req.body;

    try {
      console.log("userId:", userId);
      console.log("question:", question);

      const answerData = [];

      // NOTE: get user personal vectore store...
      const vectorStore = stores[userId] || mainVectorStore;
      // TODO: replace it
      // const vectorStore = stores["foo"];
      const ragChain = await getRagChain(vectorStore);
      const stream = await ragChain.stream({
        input: question,
        chat_history: chat_history,
      });

      const chunkDelimeter = "\n\t\t\t\n";

      for await (const chunk of stream) {
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
