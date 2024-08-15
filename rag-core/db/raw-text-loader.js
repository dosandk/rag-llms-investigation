export const rawTextLoader = async () => {
  const DATA_DIR = join(import.meta.dirname, "../docs");
  const docs = [];

  try {
    for (const fileName of await readdir(
      join(import.meta.dirname, "../docs"),
    )) {
      let data = await readFile(join(DATA_DIR, `/${fileName}`), "utf8");
      docs.push(`${data}`);
    }
  } catch (err) {
    console.error(err);
  }

  return docs;
};
