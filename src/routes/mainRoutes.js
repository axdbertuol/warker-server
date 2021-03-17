const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

const Cidade = mongoose.model("Cidade");
const Posto = mongoose.model("Posto");
const requireAdmin = require("../middlewares/requireAdmin");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// every request will require normal user logged in
router.route("/api/*").all(requireAuth);

// API POSTOS
router.post("/api/postos", async (req, res) => {
  try {
    let data = req.body;
    if (!Array.isArray(data)) {
      throw new Error("Data should be an array of postos");
    }
    // console.log(data);
    // const promises = data.map(async function ({
    for (let {
      nome_cidade,
      nome,
      coords,
      photo_reference,
      rating,
      open_now,
      place_id,
      photo_url,
    } of data) {
      // }) {
      // if(!nome_cidade)
      let query = await Posto.findOne({
        place_id,
      }).exec();
      // temporary
      // if (query) {
      //   let didSet = false;
      //   if (!query.rating) {
      //     query.rating = rating;
      //     didSet = true;
      //   }
      //   if (!query.open_now) {
      //     query.open_now = open_now;
      //     didSet = true;
      //   }
      //   if (!query?.photo_url && query.photo_reference) {
      //     const response = await axios.get(
      //       "https://maps.googleapis.com/maps/api/place/photo",
      //       {
      //         params: {
      //           maxwidth: 400,
      //           photoreference: photo_reference,
      //           key: "AIzaSyDiNGubUWbZROxIQJEIhF2Edf6AlMQaOpI",
      //         },
      //       }
      //     );
      //     const photo_url = response.request?.responseURL;
      //     // query.photo_url = photo_url;
      //     query.set("photo_url", photo_url);
      //     console.log("oi", query);
      //     didSet = true;
      //   }
      //   if (didSet) {
      //     await query.save();
      //   }
      // }
      if (!query) {
        // console.log("nome_cidade", nome_cidade);
        let cidade = await Cidade.findOne({ nome: nome_cidade });
        if (!cidade) {
          nova_cidade = new Cidade({ nome: nome_cidade });
          nova_cidade.save();
        }
        // console.log("cheguei", cidade);

        let posto = new Posto({
          cidadeId: cidade._id,
          nome,
          photo_reference,
          photo_url,
          place_id,
          coords,
          rating,
          open_now,
          // reservatorio,
        });
        // console.log(posto);
        await posto.save();
      }
    }
    // });
    return res.send("Postos criados");
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/api/postos", async (req, res) => {
  try {
    const data = req.query["postosIds"];
    let result = [];
    if (data && Array.isArray(data)) {
      for (let place_id of data) {
        const query = await Posto.findOne({ place_id }).exec();
        result.push(query);
      }

      res.send(result.filter((posto) => posto !== null));
    } else {
      res.send(await Posto.find().exec());
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send(error.message);
  }
});
// router.get("/api/postos?/:postoId", async (req, res) => {
//   try {
//     res.send(await Posto.findOne({ _id: req.params["postoId"] }).exec());
//   } catch (error) {
//     res.status(404).send("Posto não encontrado");
//   }
// });
// router.put("/api/postos?/:postoId/edit", async (req, res) => {
//   const { nome, reservatorio, coords } = req.body;
//   try {
//     const posto = await Posto.findOneAndUpdate(
//       { _id: req.params["postoId"] },
//       { $set: { nome, reservatorio, coords } }
//     );
//     res.send({ posto });
//   } catch (error) {
//     res.status(404).send("Posto não encontrado");
//   }
// });

// API CIDADES

router.post("/api/cidades?", async (req, res) => {
  const { nome } = req.body;
  try {
    const cidade = new Cidade({ nome });
    await cidade.save();
    res.send({ cidade });
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/api/cidades", async (req, res) => {
  const response = await Cidade.find().exec();
  res.send(response);
});
router.get("/api/cidade", async (req, res) => {
  try {
    // console.log("params", req.params);
    const result = await Cidade.findOne({
      nome: req.params["nome_cidade"],
    })
      .populate("postos")
      .exec();
    // console.log(result);
    res.send(result);
  } catch (error) {
    res.status(404).send("Cidade não encontrada");
  }
});

router.put("/api/postos?/:cidadeId/edit", async (req, res) => {
  const { nome } = req.body;
  try {
    const cidade = await Cidade.findOneAndUpdate(
      { _id: req.params["cidadeId"] },
      { $set: { nome } }
    );
    res.send({ cidade });
  } catch (error) {
    res.status(404).send("Cidade não encontrada");
  }
});
module.exports = router;
