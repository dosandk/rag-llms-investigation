import { join } from "node:path";
import { readdir, readFile } from "node:fs/promises";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// TODO: change to Lama embedings
import { db } from "../db/index.js";
import { embeddings } from "../llm/index.js";

const getDocsContent = async () => {
  const DATA_DIR = join(import.meta.dirname, "../docs");
  const docs = [];

  try {
    for (const fileName of await readdir(DATA_DIR)) {
      const data = await readFile(join(DATA_DIR, `/${fileName}`), "utf8");
      docs.push(`${data}`);
    }

    return docs;
  } catch (error) {
    throw new Error("Failed to load documents content", error);
  }
};

const run = async () => {
  const rawDocs = await getDocsContent();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const splits = await textSplitter.createDocuments(rawDocs);

  console.log("splits", splits);

  try {
    await db.resetDb();
  } catch (error) {
    console.error("To reset DB set ALLOW_RESET=TRUE");
  }

  // TODO: get collection name form env variables
  const collectionName = "test-collection";

  await db.createVectorStore({ splits, embeddings, collectionName });

  console.log("Docs successfully parsed");
};

try {
  await run();
} catch (error) {
  throw new Error("Failed to store data in DB", error);
}
