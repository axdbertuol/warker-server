// require("dotenv").config();
// const request = require("supertest");
// const assert = require("assert");
// const expect = require("chai").expect;
// const jwt = require("jsonwebtoken");

// const app = require("../src/index");

// const Posto = require("../src/models/Posto");
// const User = require("../src/models/User");
// const Cidade = require("../src/models/Cidade");

// describe("Testing Google Api", () => {
//   let user = { email: "alex@test.com", password: "test" };
//   let token;
//   before(async () => {
//     if (await Cidade.exists()) {
//       await Cidade.deleteMany({});
//     }
//     if (await Posto.exists()) {
//       await Posto.deleteMany({});
//     }
//     await request(app).post("/signup").send(user);
//     const response = await request(app).post("/signin").send(user);
//     token = response.body.token;
//   });

//   describe("/api/nearby", () => {
//     it("should POST", async () => {
//       const response = await request(app)
//         .post("/api/nearby")
//         .set("Authorization", "Bearer " + token)
//         .send({
//           searchTerm: "",
//           currentLocation: {
//             coords: { latitude: -27.5998783, longitude: -48.5487406 },
//           },
//         });
//       // console.log("res");
//       // console.log(response);
//       expect(response.status).to.be.equal(200);
//       const postos = await Posto.find({}).exec();
//       console.log(postos);
//       expect(postos.length).to.be.equal(8);
//       // expect(postos.filter(posto => posto.cidadeId)).to.be.equal(8);
//     });
//   });
// });
