import BaseComponent from "../base";
import { Tabs } from "../tabs/index.js";
import MainDoc from "../main-doc/index.js";
import UserDoc from "../user-doc/index.js";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
export default class DocPreview extends BaseComponent {
  components = {};
  tabsSubElements = {};

  tabsConfig = [
    {
      label: "main.md",
      iconClass: "bi-filetype-md",
      ComponentClass: MainDoc,
      isActive: true,
    },
    {
      label: "your.md",
      iconClass: "bi-filetype-md",
      ComponentClass: UserDoc,
    },
  ];

  constructor() {
    super();
    this.init();
    this.initComponents();
    this.renderTabs();
  }

  initComponents() {
    this.components.tracksTabs = new Tabs(this.tabsConfig);
  }

  renderTabs() {
    this.element.append(this.components.tracksTabs.element);
  }

  get template() {
    return <div></div>;
  }

  afterDestroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }

    this.components = {};
  }
}
