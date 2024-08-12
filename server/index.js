import app from "./src/app.js";

const start = async () => {
  const PORT = process.env.PORT || 9003;

  if (!PORT) {
    throw new Error("PORT must be defined");
  }

  process.on("unhandledRejection", (error) => {
    console.error("unhandledRejection", error);
  });

  app.listen(PORT, () => {
    console.info(`Product server is running on port ${PORT}`);
  });
};

try {
  start();
} catch (error) {
  console.log("Failed to start chat server", error.message);
}
