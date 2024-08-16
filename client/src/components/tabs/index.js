import { Tab } from "bootstrap";
import BaseComponent from "../base.js";

import "./style.css";

/** @jsx globalThis[Symbol.for("createElement")] */
export class Tabs extends BaseComponent {
  tabsButtons = [];
  tabsContainers = {};
  activeTabComponent = {};

  /**
   * @param {*} tabsOptions - array of objects
   * {
   *  label: ''         - Tab label
   *  ComponentClass: {}     - Class of component
   *  componentArgs: [] - Array of arguments for your component,
   *  isActive: true    - Set 'true' if tab should be active, 'false' by default
   *  iconClass: ''     - icon class name from bootstrap
   * }
   */
  constructor(tabsOptions = []) {
    super();
    this.init();

    this.tabsOptions = tabsOptions;
    this.initTabs();
    this.initListeners();
  }

  get template() {
    return (
      <div class="w-100">
        <div
          class="nav nav-pills tabs-buttons"
          data-element="tabsButtonsContainer"
        ></div>
        <div class="tab-content p-3" data-element="tabsContentContainer"></div>
      </div>
    );
  }

  initTabs() {
    this.tabsOptions.forEach((tabOption, index) => {
      const {
        label,
        ComponentClass,
        componentArgs = [],
        isActive = "",
        iconClass = "",
      } = tabOption;
      const active = isActive ? "active" : "";
      // NOTE: create unique name, in case the same components were passed
      const componentName = ComponentClass.name + `-${index}`;

      const tabsButtonItem = this.getTubsButtonItem({
        label,
        active,
        componentName,
        iconClass,
      });
      const tabsContainer = this.getTabsContainer({
        ComponentClass,
        componentArgs,
        componentName,
        active,
      });

      this.tabsButtons.push(tabsButtonItem);
      this.tabsContainers[componentName] = tabsContainer;

      this.subElements.tabsButtonsContainer.append(tabsButtonItem);
      this.subElements.tabsContentContainer.append(tabsContainer);
    });
  }

  getTubsButtonItem({
    label = "",
    componentName = "",
    active = "",
    iconClass = "",
  }) {
    const iconElement = iconClass ? `<i class='bi ${iconClass} pe-1'></i>` : "";
    const template = `
      <button
        type='button'
        data-bs-toggle='pill'
        data-bs-target='#${componentName}'
        aria-controls='${componentName}'
        aria-selected='${active ? true : false}'
        class='nav-item nav-link ${active}'
      >
        ${iconElement} ${label}
      </button>
    `;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = template;

    return wrapper.firstElementChild;
  }

  getTabsContainer({
    active = "",
    ComponentClass = {},
    componentArgs = [],
    componentName = "",
  }) {
    const wrapper = document.createElement("div");
    const tabContainer = `<div class='tab-pane ${active}' id='${componentName}' tabindex='0'></div>`;

    wrapper.innerHTML = tabContainer;
    const element = wrapper.firstElementChild;

    if (active) {
      this.activeTabComponent = new ComponentClass(...componentArgs);
      element.append(this.activeTabComponent.element);
    }

    return element;
  }

  initListeners() {
    for (const tabButton of this.tabsButtons) {
      tabButton.addEventListener("show.bs.tab", (event) => {
        this.activeTabComponent.destroy();

        const tabAriaControl = event.target.getAttribute("aria-controls");
        const tabComponentIndex = parseInt(tabAriaControl.split("-").at(1));
        const tabContainerElement = this.tabsContainers[tabAriaControl];
        const { ComponentClass, componentArgs } =
          this.tabsOptions[tabComponentIndex];
        const defaultComponentArguments = componentArgs || [];

        this.activeTabComponent = new ComponentClass(
          ...defaultComponentArguments,
        );

        console.error(this.activeTabComponent);

        tabContainerElement.append(this.activeTabComponent.element);
      });
    }
  }

  showTabByOrder(index = 1) {
    const tabIndex = index - 1;

    if (tabIndex < 0 || index > this.tabsButtons.length) {
      return;
    }

    const newTab = new Tab(this.tabsButtons[tabIndex]);
    newTab.show();
  }

  afterDestroy() {
    this.activeTabComponent.destroy();
    this.tabsButtons = [];
    this.tabsContainers = {};
    this.activeTabComponent = {};
  }
}
