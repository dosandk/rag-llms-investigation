export const createStore = async (userId, createdAt, content) => {
  try {
    const response = await fetch(process.env.RAG_CORE_URL + "/create-store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        createdAt,
        userId,
      }),
    });

    const json = await response.json();

    return [null, json];
  } catch (error) {
    console.error(error);
    return [error, null];
  }
};
