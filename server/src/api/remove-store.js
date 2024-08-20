export const removeStore = async (userId, createdAt) => {
  try {
    const response = await fetch(process.env.RAG_CORE_URL + "/remove-store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        createdAt,
      }),
    });

    const json = await response.json();

    return [null, json];
  } catch (error) {
    console.error(error);
    return [error, null];
  }
};
