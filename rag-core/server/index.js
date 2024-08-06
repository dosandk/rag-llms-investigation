import initApp from "./src/app.js";
import getRagChain from "../langchain/index.js";

const start = async () => {
  const PORT = process.env.PORT || 9002;

  if (!PORT) {
    throw new Error("PORT must be defined");
  }

  process.on("unhandledRejection", (error) => {
    console.error("unhandledRejection", error);
  });

  const { ragChain, retriever } = await getRagChain();
  const app = initApp(ragChain, retriever);

  app.listen(PORT, () => {
    console.info(`Product server is running on port ${PORT}`);
  });
};

try {
  start();
} catch (error) {
  console.log("Failed to start chat server", error.message);
}
