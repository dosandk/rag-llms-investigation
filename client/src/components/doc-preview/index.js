import BaseComponent from "../base";
import doc from "./doc-mock.js";
import markdownRender from "../../libs/markdown-render/index.js";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
export default class DocPreview extends BaseComponent {
  constructor() {
    super();
    this.init();
  }

  render() {
    super.render();
    this.element.innerHTML = markdownRender(doc);

    return this.element;
  }

  get template() {
    return <div class="p-3"></div>;
  }
}
