const express = require("express");
const app = express();
app.use(express.json());

// initialize server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
