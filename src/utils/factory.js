const mongoose = require("mongoose");
const Cidade = mongoose.model("Cidade");
const Posto = mongoose.model("Posto");

const { GOOGLE_MAPS_KEY } = require("./constants");
const {
  placesTextSearch,
  directionsSearch,
  distanceMatrixApi,
  textSearchApi,
  reverseGeocoderApi,
  nearbySearchApi,
  placeDetailsApi,
  photosApi,
} = require("../api/googleMaps");

const createPostos = async function (results) {
  for (let {
    name,
    place_id,
    geometry,
    photos,
    vicinity,
    opening_hours,
    rating,
  } of results) {
    if (await Posto.exists({ place_id })) continue;

    const cidadesDB = await Cidade.find({}).exec();

    if (!cidadesDB) {
      console.log("Erro: não há cidades registradas no DB");
    }

    let nome_cidade;
    console.log("cidadesDB", cidadesDB);
    for (let cidade of cidadesDB) {
      if (vicinity.includes(cidade.nome)) {
        console.log("cidadenome", cidade.nome);
        nome_cidade = cidade.nome;
        break;
      }
    }

    if (!nome_cidade) {
      console.log("Não há cidade com esse nome", nome_cidade);
      continue;
    }

    let cidadeId;
    try {
      cidadeId = await Cidade.findOne({ nome: nome_cidade }, "nome").exec();
    } catch (error) {
      console.log("cidadeId erro ", error);
    }
    console.log("Cidade id", cidadeId);

    const photo_reference = photos ? photos[0].photo_reference : null;
    let photo_url = null;
    if (photo_reference) {
      try {
        const response = await photosApi.get("", {
          params: {
            maxwidth: 400,
            photoreference: photo_reference,
            key: GOOGLE_MAPS_KEY,
          },
        });
        console.log("responseurl", response.request.res.responseUrl);
        photo_url = response.request?.res.responseUrl;
      } catch (error) {
        console.log("Getting photo ", error);
      }
    }
    //   console.log("photo", photo_reference, photo_url);

    const new_posto = new Posto({
      place_id: place_id,
      cidadeId,
      nome: name,
      photo_reference,
      photo_url,
      coords: {
        latitude: geometry.location.lat,
        longitude: geometry.location.lng,
      },
      open_now: opening_hours?.open_now,
      rating: rating,
    });
    try {
      await new_posto.save();
      // console.log("Posto criado", new_posto);
    } catch (error) {
      console.log("posto saving", error);
    }
  }
};

const createCidade = async function () {};

const createInitialCidades = async function (cidadesIniciais) {
  const cidadesDB = await Cidade.find().exec();
  if (cidadesDB.length === 0) {
    for (let nomeCidade of cidadesIniciais) {
      console.log("Criando..", nomeCidade);
      await new Cidade({ nome: nomeCidade }).save();
    }
  }
};
module.exports = { createPostos, createCidade, createInitialCidades };
