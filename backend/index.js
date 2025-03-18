// backend/index.js
const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");// doesn't have to to be installed because the express package already includes it

const rootRouter = require("./routes/index");

const app = express();

app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
