require("dotenv").config();
const express = require("express");
const connectDB = require("./db/config/config");
const { registerRoutes } = require("./src/routes");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

registerRoutes(app);

app.get("/", async (req, res) => {
  console.log("<Home > ");
  res.json({ msg: "Server is running" });
});

//Connecting the Database
connectDB();

app.listen(process.env.PORT, () => {
  console.log("server is listining on port number", process.env.PORT);
});
