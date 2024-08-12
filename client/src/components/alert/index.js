import { Alert } from "bootstrap";
import BaseComponent from "../base.js";

export default class CustomAlert extends BaseComponent {
  timerId;
  constructor(type = "success", message = "") {
    super();
    this.type = type;
    this.message = message;

    this.init();

    // NOTE: register alert for closing
    new Alert(this.element);

    this.timerId = setTimeout(() => {
      this.close();
    }, 2000);
  }

  close() {
    clearTimeout(this.timerId);

    const alert = Alert.getInstance(this.element);

    if (alert) {
      alert.close();
    }
  }

  get template() {
    return `
      <div class="alert alert-${this.type} alert-dismissible fade show position-absolute top-0 start-0 w-100" role="alert">
        ${this.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }

  beforeDestroy() {
    this.close();
  }
}
