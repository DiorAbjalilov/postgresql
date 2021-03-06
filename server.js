const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

// Initialize route
app.use("/api", require("./routes"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("****** = server is running = ******", port);
});
