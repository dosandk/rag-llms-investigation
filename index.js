import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";

import "cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { ChatOllama } from "@langchain/ollama";

import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
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

const embeddings = new OllamaEmbeddings({
  model: "llama3", // default value
  baseUrl: "http://localhost:11434", // default value
});

const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);

// Retrieve and generate using the relevant snippets of the blog.
const retriever = vectorStore.asRetriever();
const foo = await pull("rlm/rag-prompt");

console.log("prev prompt", foo);
console.log(foo.promptMessages.map((msg) => msg.prompt.template).join("\n"));

const template = `
You are an assistant for question-answering tasks. 
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know. 

Question: {question}

Context: {context} 

Answer:
`;

const customRagPrompt = PromptTemplate.fromTemplate(template);

// TODO: add prompt template maybe?
const llm = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama3", // Default value
  // temperature: 0,
});

const ragChain = await createStuffDocumentsChain({
  llm,
  prompt: customRagPrompt,
  outputParser: new StringOutputParser(),
});

const getContext = async (question = "") => {
  const result = await retriever.invoke(question);

  console.log("context", result);

  return result;
};

startConversation(async (question = "") => {
  const result = await ragChain.invoke({
    context: await getContext(question),
    question,
  });

  console.log("result", result);
});
