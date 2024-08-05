import readlineSync from "readline-sync";

const startConversation = (callback) => {
  console.log("Welcome to JS stream AI!");

  // const name = readlineSync.question("May I have your name? ");

  // console.log(`Hello, ${name}!`);
  console.log(`Type your question: `);

  const proposePrompt = async () => {
    const userAnswer = readlineSync.question(`Question: `);

    if (userAnswer === "/exit") {
      console.log("exit");
      return;
    }

    await callback(userAnswer);

    proposePrompt();
  };

  proposePrompt();
};

export default startConversation;
