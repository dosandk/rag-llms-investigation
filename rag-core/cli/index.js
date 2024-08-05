import readlineSync from "readline-sync";

// TODO: need for tests...
const startConversation = (callback) => {
  console.log("Welcome to chat with AI!");
  console.log("Type your question: ");

  const proposePrompt = async () => {
    const userQuestion = readlineSync.question("Question: ");

    if (userQuestion === "/exit") {
      console.log("exit");
      return;
    }

    await callback(userQuestion);

    proposePrompt();
  };

  proposePrompt();
};

class Chat {
  constructor(ragChain, retriever) {
    this.ragChain = ragChain;
    this.retriever = retriever;
  }

  ask = async (question = "") => {
    const context = await this.retriever.invoke(question);

    const result = await this.ragChain.invoke({
      context,
      question,
    });

    return result;
  };
}

const start = (ragChain, retriever) => {
  const chat = new Chat(ragChain, retriever);

  startConversation(chat.ask);
};

export default start;
