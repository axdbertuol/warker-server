require("dotenv").config();
const User = require("./models/User");
require("./models/Cidade");
require("./models/Posto");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const mainRoutes = require("./routes/mainRoutes");
const requireAuth = require("./middlewares/requireAuth");
const isTesting = process.env.MODE === "testing";
const dbName = isTesting ? "warker_test" : "warker";
const port = isTesting ? 3001 : 3000;
const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(mainRoutes);

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ztslp.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// get request will pass through requireAuth
// app.get("/", requireAuth, (req, res) => {
//   res.send(`Your email ${req.user.email}`);
// });

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
// if (isTesting) {
//   mongoose.connection.on("connected", async () => {
//     await User.deleteMany({});
//     console.log("Cleared db");
//   });
//   app.all("*");
// }
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance named", dbName);
});
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.listen(port, () => {
  console.log("listening on port", port);
});

module.exports = app;
