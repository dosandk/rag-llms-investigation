const { BACKEND_URL } = window[Symbol.for("app-config")];

class AppUnloadService {
  init() {
    window.addEventListener("unload", async () => {
      navigator.sendBeacon(BACKEND_URL + "/remove-store");
    });
  }
}

const appUnloadService = new AppUnloadService();

export default appUnloadService;
