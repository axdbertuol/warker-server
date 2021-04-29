const mongoose = require("mongoose");
const { getReservatorio, getFuelTypes } = require("../utils/functions");

const postoSchema = new mongoose.Schema(
  {
    nome: String,
    reservatorio: {
      type: Number,
    },
    fuelTypes: Array,
    photo_reference: String, // referencia para pegar a url da foto
    photo_url: String,
    place_id: { type: String, unique: true }, // google's id
    coords: {
      latitude: Number,
      longitude: Number,
    },
    cidadeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cidade",
      required: true,
    },
    open_now: Boolean,
    rating: Number,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// pre-save hook
postoSchema.pre("save", async function (next) {
  const posto = this;
  const Cidades = mongoose.model("Cidade");
  let query = await Cidades.findById(posto.cidadeId).exec();
  if (!query) {
    return next(new Error("Nao foi possivel achar a cidade"));
  }

  // this will generate a new random reservatorio everytime
  if (!posto.reservatorio) {
    posto.set("reservatorio", getReservatorio());
  }
  // this will generate a new random array of fuelTypes
  posto.set("fuelTypes", getFuelTypes());
  // if (!posto.fuelTypes) {
  // }

  next();
});
// post-save hook
postoSchema.post("save", async function (next) {
  const posto = this;
  // console.log("posto post-save", posto);
  const Cidades = mongoose.model("Cidade");
  let query = await Cidades.findById(posto.cidadeId).exec();
  // update postos of cidades with this posto
  if (query.postos && Array.isArray(query.postos)) {
    if (
      query.postos.length > 0 &&
      query.postos.find((p) => {
        return p.equals(posto._id);
      })
    ) {
      return;
    } else {
      query.postos.push(posto);
      await query.save();
    }
  }

  return;
});

module.exports = mongoose.model("Posto", postoSchema);
