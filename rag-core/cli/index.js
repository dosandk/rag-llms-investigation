// import getRagChain from "../langchain/index.js";
import getRagChain from "../langchain/agent.js";
import start from "./src/app.js";

try {
  const { ragChain, retriever } = await getRagChain();

  start(ragChain, retriever);
} catch (error) {
  console.log("RAG App Error:", error.message);
}
