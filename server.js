const express = require("express");
const path = require("path");

const app = express();
const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

// SPA 路由兜底（React Router 等）
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("Server listening on port:", port);
});
