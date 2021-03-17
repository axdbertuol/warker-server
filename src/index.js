require("dotenv").config();
require("./models/User");
require("./models/Cidade");
require("./models/Posto");
// require("./models/Track");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const mainRoutes = require("./routes/mainRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(mainRoutes);

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ztslp.mongodb.net/warker?retryWrites=true&w=majority`;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});
// get request will pass through requireAuth
app.get("/", requireAuth, (req, res) => {
  res.send(`Your email ${req.user.email}`);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
