import express from "express";
import { uploadFile } from '../middlewares/upload-file.js';

const router = express.Router();

const RAG_CORE_URL = process.env.RAG_CORE_URL;

if (!RAG_CORE_URL) {
  throw new Error("RAG_CORE_URL must be defined");
}

router.post("/upload", uploadFile, async (req, res, next) => {
  const { userId } = req.session;

  try {
    const response = await fetch(RAG_CORE_URL + "/create-store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Stringified file with metatada
        content: req.content,
        userId
      }),
    });

    const json = await response.json();

    if (json.error) {
      console.log('Entering')
      throw new Error(json.error)
    }

    res.json({ ok: "ok" });
  } catch (error) {
    next(error)
  }
})

export { router as uploadRouter };
