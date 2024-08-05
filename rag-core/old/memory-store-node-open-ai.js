import "dotenv/config";
import "cheerio";
import { join } from "node:path";

import { UnstructuredDirectoryLoader } from "@langchain/community/document_loaders/fs/unstructured";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChromaClient } from "chromadb";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";

import { pull } from "langchain/hub";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import startConversation from "./start-conversation.js";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// load documets as strings
import { readdir, readFile } from "node:fs/promises";

const DATA_DIR = join(import.meta.dirname, "/docs");
const docs = [];

try {
  for (const fileName of await readdir(join(import.meta.dirname, "/docs"))) {
    let data = await readFile(join(DATA_DIR, `/${fileName}`), "utf8");
    docs.push(`${data}`);
  }
} catch (err) {
  console.error(err);
}

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
});

const splits = await textSplitter.createDocuments(docs);

const openAIEmbeddings = new OpenAIEmbeddings();

const vectorStore = await MemoryVectorStore.fromDocuments(
  splits,
  openAIEmbeddings,
);

// Retrieve and generate using the relevant snippets of the blog.
const retriever = vectorStore.asRetriever();

const prompt = await pull("rlm/rag-prompt");

const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });

const ragChain = await createStuffDocumentsChain({
  llm,
  prompt,
  outputParser: new StringOutputParser(),
});

startConversation(async (question = "") => {
  const context = await retriever.invoke(question);

  console.log("-------------------- Context -------------------------");
  for (let item of context) {
    console.log(item);
  }

  const result = await ragChain.invoke({ context, question });

  console.log("result", result);
});
