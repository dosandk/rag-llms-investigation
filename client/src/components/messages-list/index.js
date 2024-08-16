import BaseComponent from "../base.js";
import markdownRender from "../../libs/markdown-render/index.js";
import AppAccordion from "../accordion/index.js";

import "./style.css";

const MAX_HISTORY_LENGTH = 3;

/** @jsx globalThis[Symbol.for("createElement")] */
export default class MessagesList extends BaseComponent {
  chat_history = [];

  constructor(dataProvider) {
    super();
    this.init();
    this.dataProvider = dataProvider;
  }

  createCursor() {
    const cursor = document.createElement("span");

    cursor.innerHTML = "▌";

    return cursor;
  }

  resetAiMessagePlaceholder(text = "") {
    const messageBox = this.lastListItem.querySelector(".message-box");
    messageBox.innerHTML = text;
  }

  async recieveData(question = "") {
    this.addHumanMessage(question);
    this.addAiMessagePlaceholder();

    const cursor = this.createCursor();
    const messageBox = this.lastListItem.querySelector(".message-box");

    const responseDataAccumulated = {
      answer: [],
      context: [],
    };

    const result = await this.dataProvider(
      question,
      this.chat_history,
      ({ json, count, done } = {}) => {
        if (responseDataAccumulated.answer.length === 0 && json.answer) {
          this.resetAiMessagePlaceholder();
        }

        console.log("chunk", count, json, done);

        if (json.answer) {
          messageBox.append(json.answer);
          messageBox.append(cursor);
          responseDataAccumulated.answer.push(json.answer);
        }
        if (json.context) {
          responseDataAccumulated.context.push(...json.context);
        }
        this.scrollElementDown(messageBox);
      },
    );
    if (result.error) {
      if (!responseDataAccumulated.answer.length) {
        this.resetAiMessagePlaceholder("request was cancelled");
        return;
      }
    }

    cursor.remove();

    const fullAnswer = responseDataAccumulated.answer.join("");

    messageBox.innerHTML = this.transformTxtToMarkdown(fullAnswer);

    const sourcesList = this.renderQuestionSource(
      responseDataAccumulated.context,
    );
    messageBox.append(sourcesList);

    this.scrollElementDown(messageBox);

    // Add messages to Chat History
    this.chat_history.push(question);
    this.chat_history.push(fullAnswer);
    // Trim history to have MAX_HISTORY_LENGTH of last message pairs
    this.chat_history = this.chat_history.slice(-1 * MAX_HISTORY_LENGTH * 2);
  }

  renderQuestionSource(sources = []) {
    const div = document.createElement("div");

    for (const [index, item] of sources.entries()) {
      const accordion = new AppAccordion(index + 1, item.pageContent);

      div.append(accordion.element);
    }

    return div;
  }

  transformTxtToMarkdown(text = "") {
    console.log("text", text);
    return markdownRender(text);
  }

  addAiMessagePlaceholder() {
    const listItem = document.createElement("li");

    const Template = () => {
      return (
        <div class="ai-message">
          <div class="left-side">
            <i class="bi bi-robot"></i>
          </div>
          <div class="right-side">
            <div class="message-box">
              <div class="card-text placeholder-glow">
                <span class="placeholder col-7"></span>&nbsp;
                <span class="placeholder col-4"></span>&nbsp;
                <span class="placeholder col-4"></span>&nbsp;
                <span class="placeholder col-6"></span>&nbsp;
                <span class="placeholder col-8"></span>&nbsp;
              </div>
            </div>
          </div>
        </div>
      );
    };

    listItem.classList.add("message-wrapper");
    listItem.append(<Template />);

    this.element.append(listItem);
    this.lastListItem = listItem;
    this.scrollElementDown(listItem);
  }

  scrollElementDown(element) {
    element.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  addHumanMessage(question = "") {
    const listItem = document.createElement("li");

    const Template = () => {
      return (
        <div class="human-message">
          <div class="left-side">
            <i class="bi bi-person"></i>
          </div>
          <div class="right-side">
            <span class="message-box">{question}</span>
          </div>
        </div>
      );
    };

    listItem.classList.add("message-wrapper");
    listItem.append(<Template />);

    this.element.append(listItem);

    this.scrollElementDown(listItem);
  }

  get template() {
    return <ul class="messages-list"></ul>;
  }
}
