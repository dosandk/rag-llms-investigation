import path from "node:path";
import { readFile } from "fs/promises";

import { Document } from "@langchain/core/documents";
import { BaseDocumentLoader } from "@langchain/core/document_loaders/base";

class BufferLoader extends BaseDocumentLoader {
  constructor(filePath = "") {
    super();
    this.filePath = filePath;
  }

  async load() {
    const file = await readFile(this.filePath, "utf8");

    const metadata = {
      // NOTE: you can provide more metadata...
      source: path.basename(this.filePath),
    };

    return this.parse(file, metadata);
  }
}

export class CustomMDLoader extends BufferLoader {
  async parse(raw, metadata) {
    // NOTE: you can prepare markdown with markdown-if for example
    // const pageContent = renderMarkdown(raw);

    return [
      new Document({
        pageContent: raw,
        metadata: {
          ...metadata,
        },
      }),
    ];
  }
}
