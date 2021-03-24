require("dotenv").config();
const request = require("supertest");
const assert = require("assert");
const expect = require("chai").expect;
const jwt = require("jsonwebtoken");

const app = require("../src/index");

const Posto = require("../src/models/Posto");
const User = require("../src/models/User");
const Cidade = require("../src/models/Cidade");

describe("Creating Cidade documents", () => {
  let cidade;
  before(async () => {
    if (await Cidade.exists()) {
      await Cidade.deleteMany({});
    }
    if (await Posto.exists()) {
      await Posto.deleteMany({});
    }
  });
  afterEach(async () => {
    await Cidade.deleteMany({});
  });
  it("creates a Cidade model", async () => {
    //GIVEN
    let cidade = await new Cidade({ nome: "Cidade teste" }).save();

    //WHEN
    cidade = await cidade.save();
    // const query = await Cidade.findById(posto.cidadeId).exec();

    //THEN
    assert(!cidade.isNew);
    expect(cidade.postos).to.be.a("array");
    expect(cidade.postos.length).to.be.equal(0);
    // expect(query.postos.length).to.equal(1);
  });
});

describe("/api/cidades", () => {
  let user = { email: "alex@test.com", password: "test" };
  let token;
  before(async () => {
    await request(app).post("/signup").send(user);
    const response = await request(app).post("/signin").send(user);
    token = response.body.token;
  });

  describe("GET /", () => {
    let cidades = [];
    let postos = [];

    before(async () => {
      if (await Cidade.exists()) {
        await Cidade.deleteMany({});
      }
      if (await Posto.exists()) {
        await Posto.deleteMany({});
      }

      for (let i = 0; i < 3; i++) {
        cidades.push(await new Cidade({ nome: "Cidade teste " + i }).save());
        for (let j = 0; j < 3; j++) {
          postos.push(
            await new Posto({
              nome: "Posto Teste",
              cidadeId: cidades[i]._id,
              place_id: "Place" + j + "-" + i,
            }).save()
          );
        }
      }
    });
    it("should return all Cidades", async () => {
      const response = await request(app)
        .get("/api/cidades")
        .set("Authorization", "Bearer " + token);

      expect(response.statusCode).to.equal(200);
      expect(response.body.length).to.equal(3);
    });

    it("should return a Cidade with populated postos", async () => {
      const response = await request(app)
        .get("/api/cidade")
        .set("Authorization", "Bearer " + token)
        .query({ nome_cidade: "Cidade teste 1" });
      expect(response.statusCode).to.equal(200);
      expect(response.body.result.nome).to.equal("Cidade teste 1");
    });
  });
  describe("POST /", () => {
    let cidades = [];
    let postos = [];

    before(async () => {
      if (await Cidade.exists()) {
        await Cidade.deleteMany({});
      }
      if (await Posto.exists()) {
        await Posto.deleteMany({});
      }

      for (let i = 0; i < 3; i++) {
        cidades.push(await new Cidade({ nome: "Cidade teste " + i }).save());
      }
      postos = [
        { nome: "Posto Teste", nome_cidade: cidades[0].nome, place_id: "A" },
        { nome: "Posto Teste 2", nome_cidade: cidades[0].nome, place_id: "B" },
        { nome: "Posto Teste", nome_cidade: cidades[1].nome, place_id: "C" },
        { nome: "Posto Teste 3", nome_cidade: cidades[2].nome, place_id: "D" },
        { nome: "Posto Teste 23", nome_cidade: cidades[1].nome, place_id: "E" },
      ];
    });
    afterEach(async () => {
      await Posto.deleteMany({});
    });

    it("should post a name and return a Cidade", async () => {
      //GIVEN
      //WHEN
      const response = await request(app)
        .post("/api/cidades")
        .set("Authorization", "Bearer " + token)
        .send({ nome: "Cidade teste x" });
      console.log(response);
      //THEN
      expect(response.body.cidade.nome).to.be.equal("Cidade teste x");
      expect(response.body.cidade.postos).to.be.an("array");
    });
  });
});
