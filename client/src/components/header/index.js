import BaseComponent from "../base";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
export default class Header extends BaseComponent {
  constructor() {
    super();
    this.init();
  }

  get template() {
    return (
      <div class="app-header">
        <div class="container-fluid h-100 d-flex align-items-center justify-content-end">
          <a
            class="dropdown-item w-auto"
            target="_blank"
            href="https://github.com/dosandk/rag-llms-investigation"
          >
            Source code: <i class="bi bi-github"></i>
          </a>
        </div>
      </div>
    );
  }
}
