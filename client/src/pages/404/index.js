import BaseComponent from "../../components/base.js";

/** @jsx globalThis[Symbol.for("createElement")] */
export default class Error404 extends BaseComponent {
  constructor() {
    super();
    this.init();
  }

  get template() {
    return (
      <div>
        <h2 class="app-page-title">404 Page</h2>
        <a href="/">go to home</a>
      </div>
    );
  }
}
