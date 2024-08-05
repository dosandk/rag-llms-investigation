import { ChatOllama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

// TODO: add dynamic llm selection
export const llm = new ChatOllama({
  // TODO: set baseUrl via env variable
  baseUrl: "http://localhost:11434",
  model: "llama3",
});

export const embeddings = new OllamaEmbeddings({
  model: "llama3",
  // TODO: set baseUrl via env variable
  baseUrl: "http://localhost:11434",
});
