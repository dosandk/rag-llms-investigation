import { renderPage } from "./render-page.js";
import { renderLayout } from "./render-layout.js";

export class Router {
  routes = [];
  defaultLayout = "app";
  activeLayout = "";

  init() {
    this.initEventListeners();

    return this;
  }

  addRoutes(routes = []) {
    for (const route of routes) {
      this.addRoute(route);
    }

    return this;
  }

  async renderLayout(layoutName = "") {
    const path = layoutName || this.defaultLayout;

    await renderLayout(path);

    this.activeLayout = layoutName;
  }

  initEventListeners() {
    /*TODO: temporary solution - remove this listener after
    implementing all navigations via Link component*/
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");
      const target = link.getAttribute("target");

      if (target === "_blank") {
        return;
      }

      if (href && href.startsWith("/")) {
        event.preventDefault();
        this.navigate(href);
      }
    });

    document.addEventListener("redirect", (event) => {
      const path = event.detail;

      if (this.strippedPath !== path) {
        this.redirectTo(path);
      }
    });

    // document.addEventListener("logout", () => {
    //   // TODO: prevent redirect if user already on home page
    //   this.redirectTo("home");
    // });
  }

  // NOTE: pattern "Facade"
  redirectTo(path = "") {
    this.navigate(path);
  }

  navigate(path = "") {
    history.pushState(null, null, path);

    this.route();

    window.dispatchEvent(
      new CustomEvent("router-navigate", {
        detail: {
          path,
        },
      }),
    );
  }

  changeState(...args) {
    history.pushState(...args);
  }

  addRoute({ pattern, path, guards = [], layout } = {}) {
    this.routes.push({ pattern, path, guards, layout });
    return this;
  }

  async changePage(path, match, search) {
    if (this.page && this.page.destroy) {
      this.page.destroy();
    }

    return await renderPage(path, match, search);
  }

  get strippedPath() {
    return (
      decodeURI(window.location.pathname)
        // NOTE: clear slashed at the start and at the end: '///foo/bar//' -> 'foo/bar'
        .replace(/^\/+|\/+$/g, "")
        // NOTE: clear slash duplicates inside route: 'foo///bar' -> 'foo/bar'
        .replace(/\/{2,}/g, "/")
    );
  }

  async route() {
    let match;

    for (const route of this.routes) {
      match = this.strippedPath.match(route.pattern);

      if (match) {
        // NOTE: run guards
        for (const item of route.guards) {
          const [guard, redirectPath] = item;
          const result = await guard();

          if (result === false) {
            this.redirectTo(redirectPath);
            return;
          }
        }

        if (route.layout && route.layout !== this.activeLayout) {
          await this.renderLayout(route.layout);
        }

        this.page = await this.changePage(
          route.path,
          match,
          window.location.search,
        );
        break;
      }
    }

    if (!match) {
      await this.renderLayout("app");
      this.page = await this.changePage("404");
      console.error("Page not found");
    }
  }

  listen() {
    window.addEventListener("popstate", () => {
      this.route();
    });

    this.route();
  }

  destroy() {
    // TODO: implement it
  }
}

const router = new Router();

export default router;
