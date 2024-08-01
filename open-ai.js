import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";

import "cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";

import { pull } from "langchain/hub";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

import startConversation from "./start-conversation.js";

const options = {
  apiKey: `${process.env.UNSTRUCTURED_API_KEY}`,
};

const loader = new UnstructuredLoader(
  "/Users/volodymyr/Projects/ELEKS/rag-llms-investigation/docs/main.md",
  options,
);
const docs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const splits = await textSplitter.splitDocuments(docs);
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
  const result = await ragChain.invoke({
    // TODO: what is this?
    context: await retriever.invoke(question),
    question: question,
  });

  console.log("result", result);
});
