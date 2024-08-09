import { ChatOllama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";

// TODO: add dynamic llm selection
export const llm = new ChatOllama({
  // TODO: set baseUrl via env variable
  baseUrl: "http://localhost:11434",
  model: "llama3",
  // TODO: set via env variables
  temperature: 0.9,
});

export const embeddings = new OllamaEmbeddings({
  model: "llama3",
  // TODO: set baseUrl via env variable
  baseUrl: "http://localhost:11434",
});

// export const embeddings = new OpenAIEmbeddings();
// export const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });
