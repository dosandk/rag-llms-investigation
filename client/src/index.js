import initJsxSupport from "./jsx-support.js";
import router from "./router/index.js";
import routes from "./routes.js";
import appUnloadService from "./services/app-unload/index.js";

import "./styles/global.scss";

// handle uncaught failed fetch through
window.addEventListener("unhandledrejection", (event) => {
  console.error("unhandledrejection", event.reason);
});

const run = async () => {
  try {
    initJsxSupport();
    appUnloadService.init();
    router.init().addRoutes(routes).listen();
  } catch (error) {
    console.error("App error: ", error);
  }
};

run();
