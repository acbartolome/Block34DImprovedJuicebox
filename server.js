const PORT = process.env.PORT || 3001;
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
require("dotenv").config();
const authRoute = require("./auth/authRoute");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoutes");

app.use(cors());

// call routes in the server to use
app.use("/users", userRoute);
app.use("/post", postRoute);
app.use("/auth", authRoute);

// initialize server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
