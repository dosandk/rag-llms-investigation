import BaseComponent from "../base";

import "./style.css";

export default class AppLoader extends BaseComponent {
  constructor() {
    super();
    this.init();
  }

  show() {
    document.body.append(this.element);
  }

  hide() {
    this.remove();
  }

  get template() {
    return `<div class="loader-overlay bg-dark-subtle position-absolute top-0 start-0 d-flex flex-column justify-content-center align-items-center">
      <div class="d-flex justify-content-center mb-3">
        <div class="spinner-border spinner-size-m" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="fs-3">Завантажуємо додаток...</div>
    </div>`;
  }
}
