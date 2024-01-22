require("dotenv").config();
const express = require("express");
const connectDB = require("./db/config/config");
const { registerRoutes } = require("./src/routes");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", (req, res) => {
  return res.json({
    message: "server is running this port",
  });
});
registerRoutes(app);

//Connecting the Database
connectDB();

app.listen(process.env.PORT, () => {
  console.log("server is listining on port number", process.env.PORT);
});
