const path = require("path");

module.exports = {
  apps: [
    // {
    //   name: "client",
    //   script: "npm",
    //   args: "start",
    //   cwd: path.resolve(__dirname, "client/"),
    // },
    {
      name: "server",
      script: "npm",
      args: "start",
      cwd: path.resolve(__dirname, "server/"),
    },
    {
      name: "rag-core",
      script: "npm",
      args: "start",
      cwd: path.resolve(__dirname, "rag-core/"),
    },
  ],
};
