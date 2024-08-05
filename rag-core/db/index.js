import { ChromaClient } from "chromadb";
import { Chroma } from "@langchain/community/vectorstores/chroma";

// TODO: add connector for pinecone <https://app.pinecone.io/>
export default class DB {
  constructor() {
    this.client = new ChromaClient();
  }

  addToCollection() {
    // TODO:...
  }

  queryFromCollection() {
    // TODO:...
  }

  async resetDb() {
    return await this.client.reset();
  }

  async getCollection(name = "", embeddingFunction) {
    const options = {
      name,
    };

    if (embeddingFunction) {
      options.embeddingFunction = embeddingFunction;
    }

    const collection = await this.client.getCollection({
      ...options,
    });

    return collection;
  }

  async deleteCollection(name = "") {
    return await this.client.deleteCollection({ name });
  }

  async createCollection(name = "", embeddingFunction) {
    const options = {
      name,
    };

    if (embeddingFunction) {
      options.embeddingFunction = embeddingFunction;
    }

    const collection = await this.client.createCollection({
      ...options,
    });

    return collection;
  }

  store = {
    collectionName: "embeddings",
  };

  // TODO: maybe move this to separate abstraction...
  async createVectorStore({ splits, embeddings, collectionName } = {}) {
    const vectorStore = await Chroma.fromDocuments(splits, embeddings, {
      collectionName,
    });

    return vectorStore;
  }

  async getVectorStore({ embeddings, collectionName } = {}) {
    const vectorStore = await Chroma.fromExistingCollection(embeddings, {
      collectionName,
    });

    return vectorStore;
  }
}

const db = new DB();

export { db };
