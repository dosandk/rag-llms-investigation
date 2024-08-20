export const chat = async (question, chat_history, userId) => {
  try {
    const response = await fetch(process.env.RAG_CORE_URL + "/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        chat_history,
        userId,
      }),
    });

    return [null, response];
  } catch (error) {
    console.error(error);
    return [error, null];
  }
};
