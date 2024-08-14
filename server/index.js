import app from "./src/app.js";

const start = async () => {
  const PORT = process.env.PORT;

  if (!PORT) {
    throw new Error("PORT must be defined");
  }

  process.on("unhandledRejection", (error) => {
    console.error("unhandledRejection", error);
  });

  app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
  });
};

try {
  start();
} catch (error) {
  console.log("Failed to start chat server", error.message);
}
