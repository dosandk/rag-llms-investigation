import BaseComponent from "../base";

import "./style.css";

export default class Footer extends BaseComponent {
  constructor() {
    super();
    this.init();
  }

  get template() {
    return `<div>some footer here...</div>`;
  }
}
