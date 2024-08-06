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
    const { question } = req.body;
    const context = await retriever.invoke(question);

    const result = await ragChain.invoke({
      context,
      question,
    });

    res.send({
      message: result,
    });
  });

  app.all("*", async () => {
    throw new Error("Not found");
  });

  return app;
};

export default initApp;
