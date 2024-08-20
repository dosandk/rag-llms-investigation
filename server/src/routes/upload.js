import express from "express";
import { uploadFile } from "../middlewares/upload-file.js";
import { createStore } from "../api/index.js";

const router = express.Router();

router.post("/upload", uploadFile, async (req, res) => {
  const { userId, createdAt } = req.session;

  const result = await createStore(userId, createdAt, req.content);
  const [error, json] = result;

  if (error) {
    return res.status(500).json({ error });
  }

  res.json({ json });
});

export { router as uploadRouter };
