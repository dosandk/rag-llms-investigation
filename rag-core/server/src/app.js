import express from "express";
import cors from "cors";

const initApp = (ragChain, retriever) => {
  const app = express();

  app.set("trust proxy", true);
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.post("/chat", async (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const { question } = req.body;

    console.log("question", question);

    const context = await retriever.invoke(question);

    // TODO: get data by chunks
    const result = await ragChain.invoke({
      context,
      question,
    });

    const arr = result.split(".");

    const wait = async (duration = 0) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), duration);
      });
    };

    // TODO: change to real streaming from langcahin
    const sendChunk = async (index) => {
      if (index >= arr.length) {
        res.end();
        return;
      }
      res.write(arr[index]);
      await wait(1000);
      sendChunk(index + 1);
    };

    sendChunk(0);
  });

  app.all("*", async () => {
    throw new Error("Not found");
  });

  return app;
};

export default initApp;
