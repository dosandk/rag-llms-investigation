import express from "express";
import cors from "cors";

import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { db } from "../../db/memory-db.js";
import getRagChain from "../../langchain/index.js";
// NOTE: uncomment if you want to merge default doc with user doc
// import { loadDocs } from "../../utils/load-docs.js";
import { embeddings } from "../../llm/index.js";
import { Document } from "@langchain/core/documents";
import StoresService from "../../services/stores-service.js";

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

  const storesService = new StoresService();

  app.post("/remove-store", async (req, res) => {
    const { userId } = req.body;

    try {
      storesService.removeStore(userId);
      res.json({ ok: "store was removed" });
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: error.message });
    }
  });

  app.post("/create-store", async (req, res) => {
    const {
      userId,
      createdAt,
      content: { file, metadata },
    } = req.body;

    const doc = new Document({
      pageContent: file,
      metadata,
    });

    try {
      // NOTE: you can merge content with default document
      // const docs = await loadDocs();
      // docs.push(doc);

      const vectorStore = await db.createVectorStore({
        embeddings,
        docs: [doc],
      });

      storesService.addStore(userId, createdAt, vectorStore);

      res.json({ status: "store was created" });
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: error.message });
    }
  });

  app.post("/chat", async (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const { question, chat_history, userId } = req.body;

    // We need to convert chat history to LangChain HumanMessage and AIMessage objects
    const langChain_chat_history = chat_history.map((item, index) =>
      index % 2 === 0 ? new AIMessage(item) : new HumanMessage(item),
    );

    try {
      console.log("userId:", userId);
      console.log("question:", question);

      const answerData = [];

      // NOTE: get user personal vectore store...
      console.error("stores", storesService.size);

      // NOTE: just for debug
      if (storesService.getStore(userId)) {
        console.error(`store for ${userId} exists!`);
      } else {
        console.error("default store will be used");
      }

      const vectorStore = storesService.getStore(userId) || mainVectorStore;
      const ragChain = await getRagChain(vectorStore);
      const stream = await ragChain.stream({
        input: question,
        chat_history: langChain_chat_history,
      });

      const chunkDelimeter = "\n\t\t\t\n";

      for await (const chunk of stream) {
        res.write(JSON.stringify(chunk) + chunkDelimeter);

        if (chunk.answer) {
          answerData.push(chunk.answer);
        }
      }

      res.end();
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  });

  app.all("*", async (req, res) => {
    throw new Error("Not found");
  });

  return app;
};

export default initApp;
