import BaseComponent from "../base.js";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
export default class UserDoc extends BaseComponent {
  constructor() {
    super();
    this.init();
  }

  get template() {
    return (
      <div>
        <button>Upload</button>
      </div>
    );
  }
}
