const assert = require("assert");
const request = require("supertest");
const app = require("../src/index");
const mongoose = require("mongoose");
const User = require("../src/models/User");

describe("Creating documents", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  it("creates a User", async () => {
    const user = new User({ email: "alex@test.com", password: "test" });
    await user.save();
    assert(!user.isNew);
  });
});

// API
describe("/signup", () => {
  beforeEach(async () => {
    // console.log(mongoose.connection);
    await User.deleteMany({});
  });
  it("creates a User", async () => {
    //GIVEN
    const user = { email: "alex@test.com", password: "test" };
    //WHEN
    const response = await request(app).post("/signup").send(user);

    //THEN
    assert(response.statusCode === 200);
    assert(response.body.token);
  });
  it("invalid email", async () => {
    //GIVEN
    const user = { email: "alextest.com", password: "test" };
    //WHEN
    const response = await request(app).post("/signup").send(user);

    //THEN
    assert(response.statusCode !== 200 && response.statusCode !== 201);
    assert(!response.body.token);
    const docs = await User.find().exec();
    assert(docs.length === 0);
  });
});

describe("/signin", () => {
  let user = { email: "alex@test.com", password: "test" };
  before(async () => {
    // console.log(mongoose.connection);
    new_user = new User(user);

    await new_user.save();
  });
  it("gets a User", async () => {
    //GIVEN

    //WHEN
    const response = await request(app).post("/signin").send(user);

    //THEN
    assert(response.statusCode === 200);
    assert(response.body.token);
  });
  it("invalid email", async () => {
    //GIVEN
    const wrong_user = { email: "alextest.com", password: "test" };
    //WHEN
    const response = await request(app).post("/signin").send(wrong_user);

    //THEN
    assert(response.statusCode !== 200 && response.statusCode !== 201);
    assert(!response.body.token);
  });
  it("invalid password", async () => {
    //GIVEN
    const wrong_user = { email: "alex@test.com", password: "testerro" };
    //WHEN
    const response = await request(app).post("/signin").send(wrong_user);

    //THEN
    assert(response.statusCode !== 200 && response.statusCode !== 201);
    assert(!response.body.token);
  });
});
