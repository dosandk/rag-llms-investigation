import BaseComponent from "../base";
import httpClient from "../../services/http-client/index.js"

import "./style.css";


const BACKEND_URL = "http://localhost:9002/test";

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

    const chunk = decoder.decode(value, { stream: true });
    const arr = chunk.split("\n\t\t\t\n");

    for (const item of arr) {
      if (!item) continue;

      const json = JSON.parse(item);

      if (json.answer) {
        callback(json.answer);
      }
    }

    read();
  };

  read();
};

sendBtn.addEventListener("click", () => {
  try {
    const question = questionInput.value;

    console.log("question", question);

    const questionWrapper = document.createElement("div");

    questionWrapper.classList.add("wrapper");
    root.append(questionWrapper);

    getData(question, (chunk = "") => {
      questionWrapper.append(chunk);
    });
  } catch (error) {
    console.log("Error getting chat data", error);
  }
});

resetBtn.addEventListener("click", () => {
  abortController.abort("Manually canceled");
  root.innerHTML = "";
});

export default class Chat extends BaseComponent {
  controller = new AbortController();

  constructor () {
    super();
    this.init();
  }

  ask () {

  }

  cancel () {

  }

  get template () {
    return `<div>
      some chat here...
      <input type="text" />

      <button>Submit</button>
    </div>`;
  }

  afterDestroy () {
    this.controller.abort();
  }
}
