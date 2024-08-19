import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export default class AppMemoryDB {
  async createVectorStore({ embeddings, docs } = {}) {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });

    const splits = await textSplitter.splitDocuments(docs);

    // NOTE: it's take a lot of time...
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splits,
      embeddings,
    );

    console.error("==== memore store was created ====");

    return vectorStore;
  }
}

const db = new AppMemoryDB();

export { db };
