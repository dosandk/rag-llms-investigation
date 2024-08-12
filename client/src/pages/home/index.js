import BaseComponent from "../../components/base.js";

// TODO: temp solution
import doc from "./document.js";
import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
class MessagesList extends BaseComponent {
  constructor() {
    super();
    this.init();
  }

  addAIMessage() {
    const listItem = document.createElement("li");

    this.element.append(listItem);

    return listItem;
  }

  addHumanMessage(question = "") {
    const listItem = document.createElement("li");

    listItem.innerHTML = question;

    this.element.append(listItem);
  }

  addMessage(question = "") {
    this.addHumanMessage(question);

    const listItem = this.addAIMessage();

    return listItem;
  }

  get template() {
    return <ul></ul>;
  }
}

export default class HomePage extends BaseComponent {
  BACKEND_URL = "http://localhost:9003/test";
  abortController = new AbortController();
  components = {};
  loading = false;

  constructor() {
    super();
    this.components.messagesList = new MessagesList();
    this.init();
  }

  stopResponse = () => {
    this.abortController.abort("Aborted by user");
    this.subElements.messageForm.reset();
    this.endLoading();
  };

  onFormSubmit = (event) => {
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

    // TODO: add message container
    const listItem = this.components.messagesList.addMessage(question);

    messageForm.reset();

    this.getData(question, (chunk = "") => {
      listItem.append(chunk);
    });
  };

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
      console.log("Error getting response: ", error);
    }
  }

  async readResponse(reader, decoder, callback) {
    const read = async () => {
      console.error("abortController", this.abortController);

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

      await read(reader, decoder, callback);
    };

    // NOTE: prevent caching reader from prev call, to finish reading of prev response call read without props
    await read(reader, decoder, callback);
  }

  startLoading() {
    // TODO: disable form
    this.loading = true;
  }

  endLoading() {
    // TODO: undisable form
    this.loading = false;
  }

  async getData(question = "", callback) {
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
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  get template() {
    const { messagesList } = this.components;
    return (
      <div class="app-home-page d-flex flex-column">
        <h2 class="app-page-title">Home Page</h2>

        <div class="home-page-content">
          <div data-element="documentContainer" class="page-side"></div>
          <div class="page-delimeter h-100"></div>
          <div data-element="chatConteiner" class="page-side">
            <div class="chat">
              <div class="chat-messages-list">{messagesList.element}</div>
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
                    <textarea
                      placeholder="your awesome message"
                      name="userMessage"
                      class="form-text-field border"
                    ></textarea>
                    <input class="btn border btn-default" type="submit" />
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
