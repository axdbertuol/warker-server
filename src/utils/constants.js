require("dotenv").config();

const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY;
const MY_SECRET_KEY = process.env.MY_SECRET_KEY;
// FILTERS

const RES_BAIXO = "res_baixo"; //  < 30%
const RES_MEDIO = "res_medio"; // > 30 % && < 70%
const RES_CHEIO = "res_cheio"; // > 70%
const DIESEL = "diesel";
const GNV = "gnv";
const ETANOL = "etanol";
module.exports = {
  GOOGLE_MAPS_KEY,
  RES_BAIXO,
  RES_MEDIO,
  RES_CHEIO,
  DIESEL,
  GNV,
  ETANOL,
  MY_SECRET_KEY,
};
