import { join } from "node:path";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { CustomMDLoader } from "./custom-md-loader.js";

export const loadDocs = async () => {
  const filePath = join(import.meta.dirname, "../docs");

  const directoryLoader = new DirectoryLoader(filePath, {
    ".md": (path) => new CustomMDLoader(path),
  });

  const docs = await directoryLoader.load();

  return docs;
};
