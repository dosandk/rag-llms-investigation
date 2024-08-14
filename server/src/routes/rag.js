import express from "express";
import { Readable, pipeline } from "node:stream";

const router = express.Router();
const RAG_CORE_URL = process.env.RAG_CORE_URL;

if (!RAG_CORE_URL) {
  throw new Error("RAG_CORE_URL must be defined");
}

router.post("/rag", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await fetch(RAG_CORE_URL + "/chat-with-stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    });

    // TODO: keep it for testing error handling on client side
    // Readable.fromWeb(response.body).pipe(res);
    // pipeline(response.body, res);
    pipeline(Readable.fromWeb(response.body), res, (error) => {
      if (error) {
        console.error("Pipeline failed.", error);
      } else {
        console.log("Pipeline succeeded.");
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export { router as ragRouter };
