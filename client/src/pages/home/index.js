import BaseComponent from "../../components/base.js";
import DocPreview from "../../components/doc-preview/index.js";
import MessagesList from "../../components/messages-list/index.js";
import markdownRender from "../../libs/markdown-render/index.js";
// NOTE: keep it import to enable bootstrap javaScript actions
import { Accordion } from "bootstrap";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
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

    const { messagesList } = this.components;

    messagesList.addHumanMessage(question);
    messagesList.addAiMessagePlaceholder();

    messageForm.reset();

    const cursor = document.createElement("span");

    cursor.innerHTML = "▌";
    cursor.classList.add("message-cursor");

    const messageBox = messagesList.lastListItem.querySelector(".message-box");

    let isFirstChunk = true;

    await this.getData(question, (chunk = "") => {
      if (isFirstChunk) {
        messageBox.innerHTML = "";
      }
      messageBox.append(chunk);
      messageBox.append(cursor);
      this.scrollElementDown(messageBox);
      isFirstChunk = false;
    });

    cursor.remove();

    const content = messageBox.innerHTML;

    messageBox.innerHTML = this.transformTxtToMarkdown(content);

    const Template = this.getSourcesTemplate();

    messageBox.append(<Template />);

    this.scrollElementDown(messageBox);
  };

  getSourcesTemplate() {
    // TODO: move accordion to separate component
    const Template = () => {
      return (
        <div class="accordion" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Accordion Item #1
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <strong>This is the first item's accordion body.</strong> It is
                shown by default, until the collapse plugin adds the appropriate
                classes that we use to style each element. These classes control
                the overall appearance, as well as the showing and hiding via
                CSS transitions. You can modify any of this with custom CSS or
                overriding our default variables. It's also worth noting that
                just about any HTML can go within the{" "}
                <code>.accordion-body</code>, though the transition does limit
                overflow.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Accordion Item #2
              </button>
            </h2>
            <div
              id="collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <strong>This is the second item's accordion body.</strong> It is
                hidden by default, until the collapse plugin adds the
                appropriate classes that we use to style each element. These
                classes control the overall appearance, as well as the showing
                and hiding via CSS transitions. You can modify any of this with
                custom CSS or overriding our default variables. It's also worth
                noting that just about any HTML can go within the{" "}
                <code>.accordion-body</code>, though the transition does limit
                overflow.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Accordion Item #3
              </button>
            </h2>
            <div
              id="collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <strong>This is the third item's accordion body.</strong> It is
                hidden by default, until the collapse plugin adds the
                appropriate classes that we use to style each element. These
                classes control the overall appearance, as well as the showing
                and hiding via CSS transitions. You can modify any of this with
                custom CSS or overriding our default variables. It's also worth
                noting that just about any HTML can go within the{" "}
                <code>.accordion-body</code>, though the transition does limit
                overflow.
              </div>
            </div>
          </div>
        </div>
      );
    };

    return Template;
  }

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
      console.log("Error getting response: ", error);
    }
  }

  async readResponse(reader, decoder, callback) {
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

        if (json.context) {
          console.error(json.context);
          this.responseContext = json.context;
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
        <div class="home-page-content">
          <div data-element="documentContainer" class="page-side">
            <DocPreview />
          </div>
          <div class="page-delimeter h-100"></div>
          <div data-element="chatConteiner" class="page-side">
            <div class="chat">
              <div class="chat-messages-list">
                <h3 class="text-center">Some welcome message!</h3>
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
