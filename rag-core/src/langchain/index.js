import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";
import { llm } from "../llm/index.js";

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

// Answer question
const qaSystemPrompt = `I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". Using the provided context, answer the user's question to the best of your ability in a structured format using the resources provided.
If there is nothing in the context relevant to the question at hand, just politely apologize and tell on which topics you can answer. Never break character.
------------
{context}
------------
REMEMBER: If there is no relevant information within the context, just politely apologize and tell on which topics you can answer. Never break character.
`;

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

const getRagChain = async (vectorStore) => {
  const retriever = ScoreThresholdRetriever.fromVectorStore(vectorStore, {
    minSimilarityScore: 0.3, // Finds results with at least this similarity score
    maxK: 4, // The maximum K value to use. Use it based to your chunk size to make sure you don't run out of tokens
    // kIncrement: 2, // How much to increase K by each time. It'll fetch N results, then N + kIncrement, then N + kIncrement * 2, etc.
  });

  // In order to search in vector store not just based on users query
  // but also include chat history and then reprase the query
  // we need this special type of retriever and not just simple vector store (as a retriever)
  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm,
    retriever,
    rephrasePrompt: contextualizeQPrompt,
  });

  const ragChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain: questionAnswerChain,
  });

  return ragChain;
};

export default getRagChain;
