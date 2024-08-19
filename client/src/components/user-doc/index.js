import BaseComponent from "../base.js";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
const { BACKEND_URL } = window[Symbol.for("app-config")];

export default class UserDoc extends BaseComponent {
  UPLOAD_URL = new URL("upload", BACKEND_URL);

  constructor() {
    super();
    this.init();
  }

  handleFileUpload = async (e) => {
    const file = e.target.files[0]
    var fileLimit = 100; // could be whatever you want 
    var fileSize = file.size;
    var fileSizeInKB = (fileSize / 1024); // this would be in kilobytes defaults to bytes

    if (fileSizeInKB < fileLimit) {
      this.subElements.errors.innerHTML = "";
      this.subElements.fileInfo.innerHTML = `File Name: ${file.name}`;

      // upload file
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch(this.UPLOAD_URL, {
          method: "POST",
          credentials: "include",
          body: formData,
          // signal: this.abortController.signal,
        });

        console.log("file passed to backend")
        return response;
      } catch (error) {
        console.error("Error getting response: ", error);
        throw new Error(error);
      }
    } else {
      this.subElements.errors.innerHTML = `File is too big. Please upload the file no more than ${fileLimit}KB`;
    }
  }

  get template() {
    return (
      <div>
        <span class="btn btn-primary btn-file">
          Upload File <input type="file" accept=".md" onChange={this.handleFileUpload} />
        </span>
        <div data-element="fileInfo"></div>
        <div data-element="errors" class="errors"></div>
      </div>
    );
  }
}
