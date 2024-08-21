import BaseComponent from "../base.js";
import markdownRender from "../../libs/markdown-render/index.js";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
const { BACKEND_URL } = window[Symbol.for("app-config")];

export default class UserDoc extends BaseComponent {
  UPLOAD_URL = new URL("upload", BACKEND_URL);
  FILE_LIMIT_KB = 50;
  abortController = new AbortController();
  UPLOAD_CONFIRMATION_MSG = `Please be aware:
\n
* we don't store your files;
* AI keeps your file in memory for a limited time: 15 mins;
* if you reload or close the page, AI loses information about your file;
`;

  constructor() {
    super();
    this.init();
  }

  showLoader() {
    const { spinner } = this.subElements;

    spinner.classList.add("visible");
    spinner.classList.remove("invisible");

    this.clearErrorMessage();
  }

  hideLoader() {
    const { spinner } = this.subElements;

    spinner.classList.add("invisible");
    spinner.classList.remove("visible");
  }

  clearErrorMessage() {
    this.showErrorMessage("");
  }

  showErrorMessage(message = "") {
    const { errorMessage, uploadInput } = this.subElements;
    console.error(`[Error]: ${message}`);

    errorMessage.innerHTML = message;
    uploadInput.value = "";
  }

  handleFileUpload = async (event) => {
    const [file] = event.target.files;
    const { uploadInput } = this.subElements;

    if (!confirm(this.UPLOAD_CONFIRMATION_MSG)) {
      uploadInput.value = "";
      return;
    }

    if (file === undefined) {
      return;
    }

    const fileSize = file.size;
    const fileSizeKB = fileSize / 1024; // this would be in kilobytes defaults to bytes
    const availableFormats = ["text/markdown", "text/plain"];

    if (!availableFormats.includes(file.type)) {
      this.showErrorMessage("Please choose `.md` or `.txt` file");
      return;
    }

    if (fileSizeKB > this.FILE_LIMIT_KB) {
      this.showErrorMessage(`Max file size: ${this.FILE_LIMIT_KB}KB`);
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      this.showLoader();

      const response = await fetch(this.UPLOAD_URL, {
        method: "POST",
        credentials: "include",
        body: formData,
        signal: this.abortController.signal,
      });

      this.renderFile(file);

      uploadInput.setAttribute("disabled", "true");
      console.log("response", response);
      console.log("file passed to backend");
    } catch (error) {
      console.error("Error getting response: ", error);
      this.showErrorMessage(error.message);
    } finally {
      this.hideLoader();
    }
  };

  renderFile(file) {
    const { fileContent } = this.subElements;
    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result;

      fileContent.innerHTML = markdownRender(content);
    };

    reader.readAsText(file);
  }

  get template() {
    return (
      <div>
        <label for="formFileSm" class="form-label text-small">
          <small>
            Use "markdown" or "text" files with a size of less than{" "}
            {this.FILE_LIMIT_KB}KB
          </small>
        </label>
        <div class="file-input-wrapper mb-1 position-relative">
          <input
            id="formFileSm"
            data-element="uploadInput"
            class="form-control form-control-sm"
            type="file"
            accept=".md, .txt"
            onChange={this.handleFileUpload}
          />
          <span
            data-element="spinner"
            class="uploading-spinner invisible spinner-border spinner-border-sm text-secondary"
            role="status"
            aria-hidden="true"
          ></span>
        </div>

        <div data-element="errorMessage" class="errors text-danger"></div>
        <div data-element="fileContent" class=""></div>
      </div>
    );
  }

  afterDestroy() {
    this.abortController.abort();
  }
}
