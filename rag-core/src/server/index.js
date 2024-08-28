import initApp from "./src/app.js";
import storesService from "../services/stores-service.js";

const start = async () => {
  const PORT = process.env.PORT;

  if (!PORT) {
    throw new Error("PORT must be defined");
  }

  process.on("unhandledRejection", (error) => {
    console.error("unhandledRejection", error);
  });

  const vectorStore = await storesService.createOrGetMainStore();
  const app = initApp(vectorStore);

  app.listen(PORT, () => {
    console.info(`RAG server is running on port ${PORT}`);
  });
};

try {
  await start();
} catch (error) {
  console.log("Failed to start chat server", error.message);
}
