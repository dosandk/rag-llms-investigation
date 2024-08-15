import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";
import { db } from "../db/index.js";
import { llm, embeddings } from "../llm/index.js";
import { searchTool } from "./tools/tavily.js";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createRetrieverTool } from "langchain/tools/retriever";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";

// Answer question
const qaSystemPrompt = `You are a helpful AI assistant. Use the following pieces of context
to answer the question at the end.

Question: {input}
Helpful answer in markdown:`;

const qaPrompt = ChatPromptTemplate.fromMessages([
  ["system", qaSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

const getRagChain = async () => {
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

  // convert our db retriever into a tool
  const retrieverTool = createRetrieverTool(retriever, {
    name: "chroma_db_search_tool",
    // to tell the agent when to use this tool
    description: "Use this tool to answer questions about software engineering and programming"
  });

  // list of our tools
  const tools = [searchTool, retrieverTool];

  // Create our agent
  const agent = await createOpenAIFunctionsAgent({
    llm,
    prompt: qaPrompt,
    tools,
  });

  // Create the executor
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    returnIntermediateSteps: true
  });

  return { ragChain: agentExecutor, retriever };
};

export default getRagChain;
