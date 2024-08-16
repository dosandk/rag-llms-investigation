import BaseComponent from "../base.js";
import markdownRender from "../../libs/markdown-render/index.js";

import mdContent from "./main.md";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
export default class MainDoc extends BaseComponent {
  constructor() {
    super();
    this.init();
  }

  get template() {
    return <div></div>;
  }

  afterRender() {
    this.element.innerHTML = markdownRender(mdContent);
  }
}
