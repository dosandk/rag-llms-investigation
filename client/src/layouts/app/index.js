import BaseComponent from "../../components/base.js";
import Header from "../../components/header/index.js";
import Footer from "../../components/footer/index.js";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
export default class App extends BaseComponent {
  element;
  components = {};

  constructor() {
    super();
    this.initComponents();
    this.init();
    this.renderComponents();
  }

  initComponents() {
    this.components.header = new Header();
    this.components.footer = new Footer();
  }

  renderComponents() {
    Object.keys(this.components).forEach((component) => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      if (element) {
        root.append(element);
      }
    });
  }

  get template() {
    return (
      <main class="app-main container-fluid">
        <header class="header" data-element="header"></header>
        <div id="content" class="content"></div>
        <footer class="footer" data-element="footer"></footer>
      </main>
    );
  }
}
