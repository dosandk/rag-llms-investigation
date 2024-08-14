import initApp from "./src/app.js";
import getRagChain from "../langchain/index.js";

const start = async () => {
  const PORT = process.env.PORT;

  if (!PORT) {
    throw new Error("PORT must be defined");
  }

  process.on("unhandledRejection", (error) => {
    console.error("unhandledRejection", error);
  });

  const { ragChain, retriever } = await getRagChain();
  const app = initApp(ragChain, retriever);

  app.listen(PORT, () => {
    console.info(`RAG server is running on port ${PORT}`);
  });
};

try {
  start();
} catch (error) {
  console.log("Failed to start chat server", error.message);
}
