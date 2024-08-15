import { join } from "node:path";
import { readFile } from "fs/promises";
import express from "express";

const router = express.Router();

const RAG_CORE_URL = process.env.RAG_CORE_URL;

if (!RAG_CORE_URL) {
  throw new Error("RAG_CORE_URL must be defined");
}
router.post("/upload", async (req, res) => {
  // TODO: add your awesome implementation here...

  res.json({ ok: "ok" });
});

export { router as uploadRouter };
