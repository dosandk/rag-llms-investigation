import express from "express";
import { removeStore } from "../api/index.js";

const router = express.Router();

router.post("/remove-store", async (req, res) => {
  const { userId, createdAt } = req.session;

  const result = await removeStore(userId, createdAt);
  const [error, json] = result;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  console.error(json);

  res.status(200).json({ status: "store was removed" });
});

export { router as storeRouter };
