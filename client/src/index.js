import router from "./router/index.js";
import routes from "./routes.js";

import "./styles/global.scss";

// handle uncaught failed fetch through
window.addEventListener("unhandledrejection", (event) => {
  console.error("unhandledrejection", event.reason);
});

const run = async () => {
  try {
    router.init().addRoutes(routes).listen();
  } catch (error) {
    console.error("App error: ", error);
  }
};

run();
