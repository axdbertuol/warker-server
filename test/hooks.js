require("dotenv").config();

const mongoose = require("mongoose");
const db_uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ztslp.mongodb.net/warker_test?retryWrites=true&w=majority`;

// connect to warker_test db before testing
// exports.mochaHooks = {
//   async beforeAll() {
//     await mongoose.connect(db_uri, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useUnifiedTopology: true,
//     });
//   },
// };
