require("dotenv").config();
const request = require("supertest");
const assert = require("assert");
const expect = require("chai").expect;
const jwt = require("jsonwebtoken");

const app = require("../src/index");

const Posto = require("../src/models/Posto");
const User = require("../src/models/User");
const Cidade = require("../src/models/Cidade");

describe("Creating Posto documents", () => {
  let cidade;
  before(async () => {
    if (await Cidade.exists()) {
      await Cidade.deleteMany({});
    }
    if (await Posto.exists()) {
      await Posto.deleteMany({});
    }
    cidade = await new Cidade({ nome: "Cidade teste" }).save();
  });
  afterEach(async () => {
    await Posto.deleteMany({});
  });
  it("creates a Posto and push it auto to Cidade", async () => {
    //GIVEN
    const posto = new Posto({ nome: "Posto Teste", cidadeId: cidade._id });

    //WHEN
    await posto.save();
    const query = await Cidade.findById(posto.cidadeId).exec();

    //THEN
    assert(!posto.isNew);
    expect(posto.reservatorio).to.be.a("number");
    expect(query.postos.length).to.equal(1);
  });
});

describe("/api/postos", () => {
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
    it("should return all postos", async () => {
      const response = await request(app)
        .get("/api/postos")
        .set("Authorization", "Bearer " + token);

      expect(response.statusCode).to.equal(200);
      expect(response.body.length).to.equal(9);
    });
    it("should return only postos with given places_ids", async () => {
      //GIVEN
      const places_ids = ["Place1-2", "Place2-1", "Place0-2"];

      //WHEN
      const response = await request(app)
        .get("/api/postos")
        .set("Authorization", "Bearer " + token)
        .query({ postosIds: places_ids });
      //THEN
      expect(response.statusCode).to.equal(200);
      expect(response.body.length).to.equal(3);
      for (let i = 0; i < 3; i++) {
        expect(places_ids[i]).to.equal(response.body[i].place_id);
      }
    });
    it("should return all postos if all given places_ids are bad", async () => {
      //GIVEN
      const places_ids = ["Place11-2", "Place21-1", "Place20-2"];
      //WHEN
      const response = await request(app)
        .get("/api/postos")
        .set("Authorization", "Bearer " + token)
        .query({ postosIds: places_ids });
      //THEN
      expect(response.statusCode).to.equal(200);
      expect(response.body.length).to.equal(0);
    });
    it("should return exact postos if some given places_ids are good", async () => {
      //GIVEN
      const places_ids = ["Place11-2", "Place21-1", "Place0-2"];
      //WHEN
      const response = await request(app)
        .get("/api/postos")
        .set("Authorization", "Bearer " + token)
        .query({ postosIds: places_ids });
      //THEN
      expect(response.statusCode).to.equal(200);
      expect(response.body.length).to.equal(1);
      expect(places_ids[2]).to.equal(response.body[0].place_id);
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

    it("should send postos Successfully", async () => {
      //GIVEN
      //WHEN
      const response = await request(app)
        .post("/api/postos")
        .set("Authorization", "Bearer " + token)
        .send(postos);

      const response2 = await request(app)
        .get("/api/postos")
        .set("Authorization", "Bearer " + token);

      //THEN
      expect(response.text).to.be.equal("Postos criados");
      expect(response2.body.length).to.be.equal(postos.length);
    });
    it("should send postos with unknown city name", async () => {
      //GIVEN
      //WHEN
      const response = await request(app)
        .post("/api/postos")
        .set("Authorization", "Bearer " + token)
        .send([
          ...postos,
          { nome: "Posto Fail", nome_cidade: "Nao existo", place_id: "F" },
        ]);

      const response2 = await request(app)
        .get("/api/postos")
        .set("Authorization", "Bearer " + token);

      //THEN
      expect(response.text).to.be.equal("Postos criados");
      expect(response2.body.length).to.be.equal(postos.length + 1);
    });
  });
});
