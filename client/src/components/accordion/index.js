import BaseComponent from "../base";
// NOTE: keep it import to enable bootstrap javaScript actions
import { Accordion } from "bootstrap";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
export default class AppAccordion extends BaseComponent {
  constructor(count = 0, content = "") {
    super();
    this.count = count;
    this.content = content;
    this.init();
  }

  getUniqId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  get template() {
    const heading = this.getUniqId();
    const collapseId = this.getUniqId();

    return (
      <div class="accordion">
        <div class="accordion-item">
          <h2 class="accordion-header" id={heading}>
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={"#" + collapseId}
              aria-expanded="false"
              aria-controls={collapseId}
            >
              Source #{this.count}
            </button>
          </h2>
          <div
            id={collapseId}
            class="accordion-collapse collapse"
            aria-labelledby={heading}
          >
            <div class="accordion-body">
              <pre>{this.content}</pre>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
