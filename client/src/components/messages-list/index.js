import BaseComponent from "../base.js";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
export default class MessagesList extends BaseComponent {
  constructor() {
    super();
    this.init();
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

  createCursor() {
    const cursor = document.createElement("span");

    cursor.innerHTML = "▌";
    cursor.classList.add("message-cursor");
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
