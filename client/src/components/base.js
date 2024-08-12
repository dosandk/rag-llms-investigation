/** @jsx globalThis[Symbol.for("createElement")] */
export default class BaseComponent {
  subElements = {};

  constructor(props, children) {
    this.props = props;
    this.children = children;
  }

  init() {
    this.beforeRender();
    this.render();
    this.getSubElements();
    this.afterRender();
  }

  beforeRender() {
    // This method will be called before render method
  }

  get template() {
    return <div></div>;
  }

  showAlert(type = "", message = "") {
    this.dispatchEvent(`show-${type}-alert`, message);
  }

  render() {
    this.element = this.template;

    const { name } = this.constructor;

    this.element.dataset.element =
      name.slice(0, 1).toLowerCase() + name.slice(1, name.length);

    return this.element;
  }

  afterRender() {
    // This method will be called after render method
  }

  getSubElements() {
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      this.subElements[name] = subElement;
    }
  }

  beforeDestroy() { }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  dispatchEvent(type = "", payload = {}) {
    if (this.element) {
      this.element.dispatchEvent(
        new CustomEvent(type, {
          detail: payload,
          bubbles: true,
        }),
      );
    }
  }

  destroy() {
    this.beforeDestroy();
    this.remove();
    this.element = null;
    this.subElements = {};
    this.afterDestroy();
  }

  afterDestroy() { }
}
