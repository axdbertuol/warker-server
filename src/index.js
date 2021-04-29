require("dotenv").config();
const User = require("./models/User");
const Cidade = require("./models/Cidade");
const Posto = require("./models/Posto");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { createInitialCidades } = require("./utils/factory");

const authRoutes = require("./routes/authRoutes");
const mainRoutes = require("./routes/mainRoutes");
const googleApiRoutes = require("./routes/googleApiRoutes");
const requireAuth = require("./middlewares/requireAuth");

const isTesting = process.env.MODE === "testing";
const dbName = isTesting ? "warker_test" : "warker";
const port = isTesting ? 3001 : 3000;

const isLocalDB = process.env.DB_MODE === "local";
const hostname = isLocalDB ? "localhost:27017" : "cluster0.ztslp.mongodb.net";
const protocol = isLocalDB ? "mongodb" : "mongodb+srv";

const app = express();
app.use(bodyParser.json());
app.use(authRoutes);
app.use(mainRoutes);
app.use(googleApiRoutes);

const mongoUri = `${protocol}://${
  !isLocalDB ? process.env.DB_USER + ":" + process.env.DB_PASS + "@" : ""
}${hostname}/${dbName}?retryWrites=true&w=majority`;
// const mongoUri = `${protocol}://${process.env.DB_USER}:${process.env.DB_PASS}@${hostname}/${dbName}?retryWrites=true&w=majority`;

// get request will pass through requireAuth
// app.get("/", requireAuth, (req, res) => {
//   res.send(`Your email ${req.user.email}`);
// });

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
// if (isLocalDB) {
//   mongoose.connection.on("connected", async () => {
//     console.log("Cleared db");
//     await Cidade.deleteMany({});
//     await Posto.deleteMany({});
//   });
// }
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance named", dbName);
  // if (isLocalDB) {
  //   (async () => {
  //     try {
  //       await Cidade.deleteMany({}).exec();
  //       await Posto.deleteMany({}).exec();
  //       console.log("Cleared db");
  //     } catch (error) {
  //       console.log("Clearing db ", error);
  //     }
  //   })();
  // }
  createInitialCidades(["Florianópolis", "São José", "Palhoça", "Biguaçu"]);
});
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.listen(port, () => {
  console.log("listening on port", port);
});

module.exports = app;
