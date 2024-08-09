import readlineSync from "readline-sync";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const startConversation = (callback) => {
  console.log("Welcome to chat with AI!");
  console.log("Type your question: ");

  const proposePrompt = async () => {
    const userQuestion = readlineSync.question("Question: ");

    if (userQuestion === "/exit") {
      console.log("exit");
      return;
    }

    const result = await callback(userQuestion);

    console.log("Answer: ", result);

    proposePrompt();
  };

  proposePrompt();
};

class Chat {
  chatHistory = [];

  constructor(ragChain, retriever) {
    this.ragChain = ragChain;
    this.retriever = retriever;
  }

  ask = async (question = "") => {
    // TODO: maybe need to make some limit for history?

    const result = await this.ragChain.invoke({
      chat_history: this.chatHistory,
      input: question,
    });

    this.chatHistory.push(new HumanMessage(question));
    this.chatHistory.push(new AIMessage(result.answer));

    return result;
  };
}

// TODO: need for tests...
const start = (ragChain, retriever) => {
  const chat = new Chat(ragChain, retriever);

  startConversation(chat.ask);
};

export default start;
