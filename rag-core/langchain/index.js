import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";
import { db } from "../db/index.js";
import { llm, embeddings } from "../llm/index.js";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

// Contextualize question
const contextualizeQSystemPrompt = `Given the following conversation and a follow up question,
rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {input}
Standalone question:`;

const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
  ["system", contextualizeQSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
]);

console.log("contextualizeQPrompt", contextualizeQPrompt);

// Answer question
const qaSystemPrompt = `You are a helpful AI assistant. Use the following pieces of context
to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {input}
Helpful answer in markdown:`;

const qaPrompt = ChatPromptTemplate.fromMessages([
  ["system", qaSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
]);

// Below we use createStuffDocuments_chain to feed all retrieved context
// into the LLM. Note that we can also use StuffDocumentsChain and other
// instances of BaseCombineDocumentsChain.
const questionAnswerChain = await createStuffDocumentsChain({
  llm,
  prompt: qaPrompt,
});

// TODO: add chat history <https://js.langchain.com/v0.2/docs/how_to/message_history/>
const getRagChain = async () => {
  // TODO: get this from env variables
  const collectionName = "test-collection";
  const vectorStore = await db.getVectorStore({
    embeddings,
    collectionName,
  });

  const retriever = ScoreThresholdRetriever.fromVectorStore(vectorStore, {
    minSimilarityScore: 0.3, // Finds results with at least this similarity score
    maxK: 7, // The maximum K value to use. Use it based to your chunk size to make sure you don't run out of tokens
    // kIncrement: 2, // How much to increase K by each time. It'll fetch N results, then N + kIncrement, then N + kIncrement * 2, etc.
  });

  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm,
    retriever,
    rephrasePrompt: contextualizeQPrompt,
  });

  const ragChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain: questionAnswerChain,
  });

  return { ragChain, retriever };
};

export default getRagChain;
