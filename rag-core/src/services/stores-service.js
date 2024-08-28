import { db } from "../db/pinecone-db.js";
// import { db } from "../db/memory-db.js";
import { Document } from "@langchain/core/documents";

class StoresService {
  SESSION_DURATION = 15 * 60 * 1000; // 15 mins
  SCHEDULER_TIMEOUT = 1 * 60 * 1000; // 1 mins

  #storesList = new Map();

  constructor(db) {
    this.db = db;
    this.runSheduler();
  }

  get size() {
    return this.#storesList.size;
  }

  getUserStore(userId = "") {
    return this.#storesList.get(userId)?.store;
  }

  async createOrGetMainStore() {
    try {
      const store = await this.db.createOrGetMainStore();

      return store;
    } catch (error) {
      console.error("Can't get store", error);
      throw new Error(error);
    }
  }

  async createUserStore(userId, createdAt, content) {
    const { file, metadata } = content;

    const doc = new Document({
      pageContent: file,
      metadata,
    });

    const store = await this.db.createUserStore({ userId, doc });

    this.#storesList.set(userId, {
      store,
      createdAt,
    });
  }

  async removeUserStore(userId = "") {
    this.#storesList.delete(userId);

    await this.db.remove(userId);

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
              this.removeUserStore(userId);
            }
          }
        }

        step();
      }, this.SCHEDULER_TIMEOUT);
    };
  }
}

const storesService = new StoresService(db);

export default storesService;
