import BaseComponent from "../../components/base.js";
import DocPreview from "../../components/doc-preview/index.js";
import MessagesList from "../../components/messages-list/index.js";
import markdownRender from "../../libs/markdown-render/index.js";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
export default class HomePage extends BaseComponent {
  BACKEND_URL = "http://localhost:9003/test";

  abortController = new AbortController();
  components = {};
  loading = false;

  constructor() {
    super();
    this.components.messagesList = new MessagesList(this.getData);
    this.init();
  }

  stopResponse = () => {
    this.abortController.abort("Aborted by user");
    this.subElements.messageForm.reset();
    this.endLoading();
  };

  onKeyPress = (event) => {
    // TODO: add sending message via keyboard
    if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();

      // add some logic here
    }
  };

  onFormSubmit = async (event) => {
    event.preventDefault();

    const { messageForm } = this.subElements;
    const { userMessage } = messageForm.elements;
    const question = userMessage.value.trim();

    if (!question) {
      return;
    }

    if (this.loading) {
      return;
    }

    this.abortController = new AbortController();

    messageForm.reset();

    await this.components.messagesList.recieveData(question);
  };

  transformTxtToMarkdown(text = "") {
    return markdownRender(text);
  }

  scrollElementDown(element) {
    element.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  async getResponse(question = "") {
    try {
      const response = await fetch(this.BACKEND_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question,
          stream: true,
        }),
        signal: this.abortController.signal,
      });

      return response;
    } catch (error) {
      console.error("Error getting response: ", error);
      throw new Error(error);
    }
  }

  async readResponse(reader, decoder, callback) {
    const read = async (reader, decoder, callback, count) => {
      const { done, value } = await reader.read();

      if (done) {
        console.log("Response readed!");
        callback({ done: true, json: {} });
        return;
      }

      const chunk = decoder.decode(value, { stream: true });
      const arr = chunk.split("\n\t\t\t\n");

      for (const item of arr) {
        if (!item) continue;

        const json = JSON.parse(item);

        callback({ count, json, done: false, count });
      }

      await read(reader, decoder, callback, count + 1);
    };

    // NOTE: prevent caching reader from prev call, to finish reading of prev response call read without props
    await read(reader, decoder, callback, 0);
  }

  startLoading() {
    // TODO: disable form
    this.loading = true;
  }

  endLoading() {
    // TODO: undisable form
    this.loading = false;
  }

  getData = async (question = "", callback) => {
    if (this.loading === true) {
      return;
    }

    try {
      this.startLoading();
      const response = await this.getResponse(question);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      await this.readResponse(reader, decoder, callback);

      this.endLoading();
      return { error: false };
    } catch (error) {
      console.error(error);
      return { error: true };
    }
  };

  get template() {
    const { messagesList } = this.components;

    return (
      <div class="app-home-page d-flex flex-column">
        <div class="home-page-content">
          <div data-element="documentContainer" class="page-side">
            <DocPreview />
          </div>
          <div class="page-delimeter h-100"></div>
          <div data-element="chatConteiner" class="page-side">
            <div class="chat">
              <div class="chat-messages-list">
                <h3 class="text-center welcome-message">
                  <span class="ollama-logo"></span>
                  <span>Hello, I'm Ollam3. How can I help you today?</span>
                </h3>
                {messagesList.element}
              </div>
              <div class="chat-user-input">
                {/* TODO: move to separate component */}
                <form
                  data-element="messageForm"
                  class="message-form"
                  onSubmit={this.onFormSubmit}
                >
                  <fieldset
                    data-element="formFieldset"
                    class="message-form-fieldset"
                  >
                    <div class="input-group">
                      <textarea
                        name="userMessage"
                        class="form-control form-text-field border"
                        placeholder="Enter your question"
                      />
                      <button type="submit" class="btn btn-primary">
                        <i class="bi bi-send"></i>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={this.stopResponse}
                      class="btn border btn-default"
                    >
                      Stop
                    </button>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  afterDestroy() {
    this.abortController.abort();
  }
}
