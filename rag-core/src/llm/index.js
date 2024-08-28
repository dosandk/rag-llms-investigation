import { ChatOllama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";

// export const llm = new ChatOllama({
//   baseUrl: "http://localhost:11434",
//   model: "llama3.1",
//   temperature: 0.9,
// });
//
// export const embeddings = new OllamaEmbeddings({
//   model: "llama3.1",
//   baseUrl: "http://localhost:11434",
// });

export const embeddings = new OpenAIEmbeddings();
export const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0.4 });
