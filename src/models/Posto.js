const mongoose = require("mongoose");
const Cidades = mongoose.model("Cidade");
const { getReservatorio, getFuelType } = require("../utils/functions");

const postoSchema = new mongoose.Schema(
  {
    nome: String,
    reservatorio: {
      type: Number,
      default: Math.floor(Math.random() * Math.floor(100)),
    },
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
    },
    open_now: Boolean,
    rating: Number,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// pre-save hook
postoSchema.pre("save", async function (next) {
  const posto = this;
  // console.log("p", posto);
  const query = await Cidades.findById(posto.cidadeId).exec();
  if (!query) {
    return next(new Error("Nao foi possivel achar a cidade"));
  }
  if (posto.isNew) {
    posto.set("reservatorio", getReservatorio());
  }
  // update postos of cidades with this posto
  if (
    query.postos &&
    Array.isArray(query.postos) &&
    query.postos.length > 0 &&
    !query.postos.find((p) => p?._id.equals(posto._id))
  ) {
    query.postos.push(posto);
    await query.save();
  }
  next();
});
mongoose.model("Posto", postoSchema);
