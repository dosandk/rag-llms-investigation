import puppeteer from "puppeteer";
import StaticServer from "static-server";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";

const BUILD_DIR = "./build";

const startServer = () => {
  const server = new StaticServer({
    rootPath: BUILD_DIR, // required, the root of the server file tree
    port: 9005, // required, the port to listen
    name: "SRR-server", // optional, will set "X-Powered-by" HTTP header
    host: "localhost", // optional, defaults to any interface
  });

  return new Promise((resolve) => {
    server.start(() => {
      console.log(
        "Server listening to",
        `http://${server.host}:${server.port}`,
      );

      return resolve(server);
    });
  });
};

const getAppContent = async (url = "") => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle0" });

  const root = await page.$("#root");
  const html = await root.getProperty("innerHTML");
  const content = await html.jsonValue();
  await browser.close();

  return content;
};

const replaceContent = async (html = "") => {
  const FILE_PATH = join(import.meta.dirname, `${BUILD_DIR}/index.html`);
  const fileContent = await readFile(FILE_PATH, "utf-8");

  return fileContent.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`,
  );
};

const writeToFile = (html = "") => {
  writeFileSync(join(import.meta.dirname, `${BUILD_DIR}/index.html`), html, {
    encoding: "utf8",
    flag: "w",
  });
};

const run = async () => {
  try {
    const server = await startServer();
    const url = `http://${server.host}:${server.port}`;
    const appContent = await getAppContent(url);

    server.stop();

    const html = await replaceContent(appContent);

    writeToFile(html);

    console.log("SSR was successfully added");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
};

run();
