import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { db } from "../db/index.js";
import { llm, embeddings } from "../llm/index.js";

const template = `
You are an assistant for question-answering tasks. 
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know. 

Question: {question}

Context: {context} 

Answer:
`;

// TODO: add chat history <https://js.langchain.com/v0.2/docs/how_to/message_history/>
const getRagChain = async () => {
  // TODO: get this from env variables
  const collectionName = "test-collection";
  const customRagPrompt = PromptTemplate.fromTemplate(template);
  const vectorStore = await db.getVectorStore({
    embeddings,
    collectionName,
  });
  const retriever = vectorStore.asRetriever();

  const ragChain = await createStuffDocumentsChain({
    llm,
    prompt: customRagPrompt,
    outputParser: new StringOutputParser(),
  });

  return { ragChain, retriever };
};

export default getRagChain;
