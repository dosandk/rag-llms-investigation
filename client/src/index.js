const root = document.getElementById("root");
const questionInput = document.getElementById("questionInput");
const sendBtn = document.getElementById("sendBtn");
const resetBtn = document.getElementById("resetBtn");

const BACKEND_URL = "http://localhost:9002/chat";

// const question = "how to Create a fork version of the matrix repo";

const abortController = new AbortController();

const getData = async (question = "", callback) => {
  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      question,
    }),
    signal: abortController.signal,
  });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  const read = async () => {
    const { done, value } = await reader.read();

    if (done) {
      console.log("Response readed!");
      return;
    }

    const chunk = decoder.decode(value);

    console.log("chunk", chunk);
    callback(chunk);

    read();
  };

  read();
};

sendBtn.addEventListener("click", () => {
  try {
    const question = questionInput.value;

    console.log("question", question);

    getData(question, (chunk = "") => {
      root.append(chunk);
    });
  } catch (error) {
    console.log("Error getting chat data", error);
  }
});

resetBtn.addEventListener("click", () => {
  abortController.abort("Manually canceled");
  root.innerHTML = "";
});
