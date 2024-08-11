import BaseComponent from "../base";

import "./style.css";

export default class Header extends BaseComponent {
  constructor() {
    super();
    this.init();
  }

  get template() {
    return `<div>some header here...</div>`;
  }
}
