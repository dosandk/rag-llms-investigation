import BaseComponent from "../base";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
export default class Footer extends BaseComponent {
  constructor() {
    super();
    this.init();
  }

  get template() {
    return <div class="app-footer">some footer here...</div>;
  }
}
