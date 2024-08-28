import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/pinecone";

import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

import { loadDocs } from "../utils/load-docs.js";
import { embeddings } from "../llm/index.js";

const PINECONE_INDEX = process.env.PINECONE_INDEX;

if (!PINECONE_INDEX) {
  throw new Error("PINECONE_INDEX must be defined");
}

export default class PineconeDB {
  constructor() {
    this.pinecone = new PineconeClient();
    this.pineconeIndex = this.pinecone.Index(PINECONE_INDEX);

    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });
    this.embeddings = embeddings;
  }

  async getMainStore() {
    const vectorStore = await PineconeStore.fromExistingIndex(this.embeddings, {
      pineconeIndex: this.pineconeIndex,
      // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
      maxConcurrency: 5,
      // You can pass a namespace here too
      namespace: "main",
    });

    this.vectorStore = vectorStore;

    return this.vectorStore;
  }

  async createOrGetMainStore() {
    const isNameSpaceExists = await this.checkNamespaceExists("main");

    if (!isNameSpaceExists) {
      return await this.createMainStore();
    }

    return await this.getMainStore();
  }

  async checkNamespaceExists(namespace = "") {
    try {
      const vectors = await this.pineconeIndex.describeIndexStats({
        namespace: namespace,
      });

      if (vectors.namespaces && vectors.namespaces[namespace]) {
        console.log(`Namespace '${namespace}' exists.`);
        return true;
      } else {
        console.log(`Namespace '${namespace}' does not exist.`);
        return false;
      }
    } catch (error) {
      console.log(`Error querying namespace '${namespace}':`, error);
      return false;
    }
  }

  async createMainStore() {
    const docs = await loadDocs();

    this.vectorStore = await this.#createStore(docs, "main");

    return this.vectorStore;
  }

  async #createStore(docs = [], namespace = "") {
    const splits = await this.textSplitter.splitDocuments(docs);

    const vectorStore = await PineconeStore.fromDocuments(
      splits,
      this.embeddings,
      {
        pineconeIndex: this.pineconeIndex,
        namespace,
      },
    );

    return vectorStore;
  }

  async createUserStore({ userId, doc } = {}) {
    const docs = [doc];

    // NOTE: revrite main store
    this.vectorStore = await this.#createStore(docs, userId);

    return this.vectorStore;
  }

  async remove(userId = "") {
    // TODO: organize the deletion of namespaces that have already been created in the database
    await this.vectorStore.delete({
      namespace: userId,
      deleteAll: true,
    });
  }
}

const db = new PineconeDB();

export { db };
