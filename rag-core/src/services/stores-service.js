export default class StoresService {
  #storesList = new Map();
  SESSION_DURATION = 15 * 60 * 1000; // 15 mins
  SCHEDULER_TIMEOUT = 1 * 60 * 1000; // 1 mins

  constructor() {
    this.runSheduler();
  }

  get storesList() {
    return this.#storesList;
  }

  get size() {
    return this.#storesList.size;
  }

  getStore(userId = "") {
    return this.#storesList.get(userId)?.store;
  }

  addStore(userId = "", createdAt = "", store = {}) {
    this.#storesList.set(userId, { createdAt, store });

    return this.#storesList;
  }

  removeStore(userId = "") {
    this.#storesList.delete(userId);

    return this.#storesList;
  }

  runSheduler() {
    const step = () => {
      // NOTE: there is no need to stop recursion, it loops infinitely

      setTimeout(() => {
        if (this.#storesList.size > 0) {
          for (const [userId, value] of this.#storesList) {
            const { createdAt } = value;

            const timeDiff = Date.now() - createdAt;

            if (timeDiff > this.SESSION_DURATION) {
              this.removeStore(userId);
            }
          }
        }

        step();
      }, this.SCHEDULER_TIMEOUT);
    };

    step();
  }

  clearAll() {
    this.#storesList = new Map();
  }
}
