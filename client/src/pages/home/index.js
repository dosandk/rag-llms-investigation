import BaseComponent from "../../components/base.js";
import DocPreview from "../../components/doc-preview/index.js";
import MessagesList from "../../components/messages-list/index.js";
import markdownRender from "../../libs/markdown-render/index.js";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
const { BACKEND_URL } = window[Symbol.for("app-config")];

export default class HomePage extends BaseComponent {
  RAG_URL = new URL("rag", BACKEND_URL);
  // RAG_URL = new URL("test", BACKEND_URL);

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
    this.stopLoading();
  };

  onFormSubmit = (event) => {
    event.preventDefault();

    this.askQuestion();
  };

  onKeyPress = (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();

      this.askQuestion();
    }
  };

  startLoading() {
    const { formFieldset, stopBtn } = this.subElements;

    this.loading = true;
    formFieldset.setAttribute("disabled", "true");

    stopBtn.classList.remove("btn-default");
    stopBtn.classList.add("btn-danger");
    stopBtn.removeAttribute("disabled");
  }

  stopLoading() {
    const { formFieldset, stopBtn } = this.subElements;

    this.loading = false;
    formFieldset.removeAttribute("disabled");

    stopBtn.classList.add("btn-default");
    stopBtn.classList.remove("btn-danger");
    stopBtn.setAttribute("disabled", "true");
  }

  async askQuestion() {
    const { messageForm } = this.subElements;

    if (!messageForm.checkValidity()) {
      messageForm.classList.add("was-validated");
      return;
    }

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

    try {
      this.startLoading();
      await this.components.messagesList.recieveData(question);
    } finally {
      this.stopLoading();
    }
  }

  transformTxtToMarkdown(text = "") {
    return markdownRender(text);
  }

  scrollElementDown(element) {
    element.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  async getResponse(question = "", chat_history = []) {
    try {
      const response = await fetch(this.RAG_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          question,
          chat_history
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

        callback({ count, json, done: false });
      }

      await read(reader, decoder, callback, count + 1);
    };

    // NOTE: prevent caching reader from prev call, to finish reading of prev response call read without props
    await read(reader, decoder, callback, 0);
  }

  getData = async (question = "", chat_history = [], callback) => {
    try {
      const response = await this.getResponse(question, chat_history);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      await this.readResponse(reader, decoder, callback);

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
                  novalidate
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
                        required
                        onKeyPress={this.onKeyPress}
                        name="userMessage"
                        class="form-control form-text-field border"
                        placeholder="Enter your question"
                      />
                      <button type="submit" class="btn btn-primary">
                        <i class="bi bi-send"></i>
                      </button>
                    </div>
                  </fieldset>
                  <button
                    type="button"
                    data-element="stopBtn"
                    disabled
                    onClick={this.stopResponse}
                    class="btn border btn-default"
                  >
                    <i class="bi bi-stop-circle"></i>
                  </button>
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
