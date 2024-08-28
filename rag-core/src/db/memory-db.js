import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { loadDocs } from "../utils/load-docs.js";
import { embeddings } from "../llm/index.js";

export default class AppMemoryDB {
  constructor() {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });
    this.embeddings = embeddings;
  }

  async #createStore(docs = []) {
    const splits = await this.textSplitter.splitDocuments(docs);

    // NOTE: it's take a lot of time...
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splits,
      this.embeddings,
    );

    console.error("==== memore store was created ====");

    return vectorStore;
  }

  // NOTE: for memory store we have only store creation
  async createOrGetMainStore() {
    const docs = await loadDocs();

    return await this.#createStore(docs);
  }

  async createUserStore({ doc = "" } = {}) {
    const docs = [doc];

    return await this.#createStore(docs);
  }

  async remove() {
    // NOTE: abstract method
  }
}

const db = new AppMemoryDB();

export { db };
