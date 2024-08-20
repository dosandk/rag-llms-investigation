const RAG_CORE_URL = process.env.RAG_CORE_URL;

if (!RAG_CORE_URL) {
  throw new Error("RAG_CORE_URL must be defined");
}

export { createStore } from "./create-store.js";
export { removeStore } from "./remove-store.js";
export { chat } from "./chat.js";
