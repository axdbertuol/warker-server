const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const Cidade = mongoose.model("Cidade");
const Posto = mongoose.model("Posto");
const requireAdmin = require("../middlewares/requireAdmin");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// every request will require normal user logged in
router.route("/api/*").all(requireAuth);

// API POSTOS
// router.post("/api/postos", async (req, res) => {
//   try {
//     let data = req.body;
//     if (!Array.isArray(data)) {
//       throw new Error("Data should be an array of postos");
//     }

//     for (const {
//       nome_cidade,
//       nome,
//       coords,
//       photo_reference,
//       rating,
//       open_now,
//       place_id,
//       photo_url,
//     } of data) {
//       let query = await Posto.findOne({
//         place_id,
//       }).exec();

//       if (!query) {
//         let cidade = await Cidade.findOne({ nome: nome_cidade });
//         if (!cidade) {
//           cidade = await new Cidade({ nome: nome_cidade }).save();
//         }

//         const posto = new Posto({
//           cidadeId: cidade._id,
//           nome,
//           photo_reference,
//           photo_url,
//           place_id,
//           coords,
//           rating,
//           open_now,
//         });
//         await posto.save();
//       }
//     }
//     // });
//     return res.send("Postos criados");
//   } catch (err) {
//     console.log(err.message);
//   }
// });

router.get("/api/postos", async (req, res) => {
  try {
    const data = req.query["postosIds"];
    let result = [];
    if (data && Array.isArray(data)) {
      for (let place_id of data) {
        const doc = await Posto.findOne({ place_id }).exec();
        if (doc) result.push(doc);
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
  try {
    const response = await Cidade.find().exec();
    res.send(response);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/api/cidade", async (req, res) => {
  try {
    const result = await Cidade.findOne({
      nome: req.query?.nome_cidade,
    })
      .populate("postos")
      .exec();

    if (!result) {
      throw new Error("Cidade nao encontrada");
    }
    res.send({ result });
  } catch (error) {
    res
      .status(404)
      .send(
        "ERROR: GET /api/cidade with params: " +
          req.query?.nome_cidade +
          "\n" +
          error
      );
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

router.get("/api/user", async (req, res) => {
  if (req.user) {
    console.log("user req", req.user);
    res.send({ _id: req.user._id, email: req.user.email });
    return;
  }

  const token = req.query["token"];
  const user = jwt.verify(token, MY_SECRET_KEY, async (err, payload) => {
    console.log("payload", payload);

    if (err) {
      return res.status(401).send({ error: "You must be logged in" });
    }
    const { userId } = payload;

    const user = await User.findById(userId);
    req.user = user;
    return user;
  });
  res.send({ _id: user._id, email: user.email });
});
module.exports = router;
