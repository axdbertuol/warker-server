const express = require("express");
const mongoose = require("mongoose");

const _ = require("lodash");
const Cidade = mongoose.model("Cidade");
const Posto = mongoose.model("Posto");
const { createPostos } = require("../utils/factory");
const {
  GOOGLE_MAPS_KEY,
  RES_BAIXO,
  RES_MEDIO,
  RES_CHEIO,
  DIESEL,
  GNV,
  ETANOL,
} = require("../utils/constants");
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
const requireAdmin = require("../middlewares/requireAdmin");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// router.route("/api/google").all(requireAuth);

/** Routes for google maps Places Api */

/**
 *  GET Nearby Search (Places Api )
 *	The params should be passed in as URL parameters.
 *
 * @param {string} query - the term to search for
 * @param {string} lat - the latitude coordinate
 * @param {string} lng - the longitude coordinate
 * @param {number} radius - the radius in kilometers
 */

router.get("/api/nearbysearch", async (req, res) => {
  try {
    const { query, lat, lng, radius, filters } = req.query;
    const response = await nearbySearchApi.get("", {
      params: {
        location: `${lat},${lng}`,
        keyword: query,
        type: "gas_station",
        radius: radius ? radius * 10000 : "",
        rankby: radius ? "" : "distance",
      },
    });
    const results = response.data["results"];
    const sequence = results.map(({ place_id }) => place_id);

    // Create and save postos that does not exist in DB
    createPostos(results);
    // console.log(results);

    // Filter postos using the filters from the request

    const queryObj = {};
    let fuelQuery = [];
    if (query) {
      queryObj.nome = new RegExp(".*" + query + ".*");
    }
    if (filters) {
      if (filters.includes(RES_BAIXO)) {
        queryObj.reservatorio = { $lt: 30 };
      } else if (filters.includes(RES_MEDIO)) {
        queryObj.reservatorio = { $gte: 30, $lt: 70 };
      } else if (filters.includes(RES_CHEIO)) {
        queryObj.reservatorio = { $gte: 70 };
      }

      if (filters.includes(DIESEL)) {
        fuelQuery.push(DIESEL);
        queryObj.fuelTypes = { $in: fuelQuery };
      }
      if (filters.includes(GNV)) {
        fuelQuery.push(GNV);
        queryObj.fuelTypes = { $in: fuelQuery };
      }
      if (filters.includes(ETANOL)) {
        fuelQuery.push(ETANOL);
        queryObj.fuelTypes = { $in: fuelQuery };
      }
    }
    console.log("queryObj", queryObj);
    const postos = await Posto.find(queryObj).exec();
    console.log("postos", postos);
    // Filter all postos with the place_id sequence provided
    // by the search if it's to rank by distance
    if (response.config.params.rankby === "distance") {
      const result_arr = postos.filter((posto) => {
        return sequence.includes(posto.place_id);
      });
      res.send({ result: result_arr });
    } else {
      res.send({ result: postos });
    }
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
