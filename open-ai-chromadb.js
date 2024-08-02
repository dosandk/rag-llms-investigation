import 'dotenv/config'
import "cheerio";
import { join } from "node:path";

import { UnstructuredDirectoryLoader } from "@langchain/community/document_loaders/fs/unstructured";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";

import { pull } from "langchain/hub";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import startConversation from "./start-conversation.js";

const options = {
  apiKey: `${process.env.UNSTRUCTURED_API_KEY}`,
};

const loader = new UnstructuredDirectoryLoader(
  join(import.meta.dirname, '/docs'),
  options
);
const docs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const splits = await textSplitter.splitDocuments(docs);
const openAIEmbeddings = new OpenAIEmbeddings();

const vectorStore = await Chroma.fromDocuments(splits, openAIEmbeddings, { collectionName: "test-collection" });
// const vectorStore = new Chroma(openAIEmbeddings, { collectionName: "test-collection" });
// const ids = await vectorStore.addDocuments(splits);
// console.log('ids', ids, ids.length)


// Retrieve and generate using the relevant snippets of the blog.
// const retriever = vectorStore.asRetriever();
const prompt = await pull("rlm/rag-prompt");

const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });

const ragChain = await createStuffDocumentsChain({
  llm,
  prompt,
  outputParser: new StringOutputParser(),
});


startConversation(async (question = "") => {
  const context = await vectorStore.similaritySearch(question, 5);

  console.log('-------------------- Context -------------------------', context.map(el => el.pageContent))

  const result = await ragChain.invoke({ context, question });

  console.log("result", result);
});
