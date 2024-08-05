import getRagChain from "./langchain/index.js";
import start from "./cli/index.js";

try {
  const { ragChain, retriever } = await getRagChain();

  start(ragChain, retriever);
} catch (error) {
  console.log("RAG App Error:", error.message);
}
