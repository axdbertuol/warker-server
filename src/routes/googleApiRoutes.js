const express = require("express");
const mongoose = require("mongoose");

const Cidade = mongoose.model("Cidade");
const Posto = mongoose.model("Posto");
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

// every request will require normal user logged in
// router.route("/api/google").all(requireAuth);

/** Routes for google maps api */

/**
 *  GET nearby search api
 * @param {searchTerm}
 */
