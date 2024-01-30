require("dotenv").config();
const express = require("express");
const { connect } = require("./db/config/config");
const { registerRoutes } = require("./src/routes");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
// const multer = require("multer");
// app.use(multer);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

registerRoutes(app);

connect();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server is listining on port number", PORT);
});
