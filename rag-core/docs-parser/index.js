import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";

import {
  RecursiveCharacterTextSplitter,
  MarkdownTextSplitter,
} from "@langchain/textsplitters";

// TODO: change to Lama embedings
import { db } from "../db/index.js";
import { embeddings } from "../llm/index.js";

import { UnstructuredDirectoryLoader } from "@langchain/community/document_loaders/fs/unstructured";

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

// NOTE: Unstructured loader
// const options = {
//   apiKey: `${process.env.UNSTRUCTURED_API_KEY}`,
// };

// const loader = new UnstructuredDirectoryLoader(
//   join(import.meta.dirname, "../docs"),
//   options,
// );

const run = async () => {
  const rawDocs = await getDocsContent();
  // NOTE: Unstructured loader
  // const rawDocs = await loader.load();

  const textSplitter = new MarkdownTextSplitter({
    chunkSize: 300,
    chunkOverlap: 20,
  });

  const splits = await textSplitter.createDocuments(rawDocs);
  // NOTE: use it only with UnstructuredLoader
  // const splits = await textSplitter.splitDocuments(rawDocs);

  // try {
  //   writeFileSync("./splits.json", JSON.stringify(splits), {
  //     encoding: "utf8",
  //   });
  // } catch (error) {
  //   console.log(error);
  // }

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
