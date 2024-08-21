import express from "express";
import { Readable, pipeline } from "node:stream";
import { chat } from "../api/index.js";

const router = express.Router();

router.post("/rag", async (req, res) => {
  try {
    const { question, chat_history } = req.body;
    const { userId } = req.session;

    console.error("userId", userId);

    const [error, response] = await chat(question, chat_history, userId);

    if (error) {
      return res.status(500).json({ error: "can't get access to 'rag-core'" });
    }

    pipeline(
      Readable.fromWeb(response.body, { highWaterMark: 10, objectMode: true }),
      res,
      (error) => {
        if (error) {
          console.error("Pipeline failed.", error);
        } else {
          console.log("Pipeline succeeded.");
        }
      },
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

export { router as ragRouter };
