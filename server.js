const PORT = 3000;
const express = require("express");
const server = express();
server.use(express.json());

// initialize server
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
