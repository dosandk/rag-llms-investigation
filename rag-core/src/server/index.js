import initApp from "./src/app.js";
import { embeddings } from "../llm/index.js";
import { loadDocs } from "../utils/load-docs.js";
import { db } from "../db/memory-db.js";

const start = async () => {
  const PORT = process.env.PORT;

  if (!PORT) {
    throw new Error("PORT must be defined");
  }

  process.on("unhandledRejection", (error) => {
    console.error("unhandledRejection", error);
  });

  const docs = await loadDocs();
  const vectorStore = await db.createVectorStore({
    embeddings,
    docs,
  });

  const app = initApp(vectorStore);

  app.listen(PORT, () => {
    console.info(`RAG server is running on port ${PORT}`);
  });
};

try {
  start();
} catch (error) {
  console.log("Failed to start chat server", error.message);
}
