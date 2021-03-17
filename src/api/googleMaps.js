const axios = require("axios");
import { GOOGLE_MAPS_KEY } from "../utils/constants";

const timeout = 5000;
const params = { key: GOOGLE_MAPS_KEY, language: "pt-BR" };

const placesTextSearch = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
  timeout,
  params,
});

const directionsSearch = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/directions/json",
  timeout,
  params,
});

const distanceMatrixApi = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/distancematrix/json",
  timeout,
  params,
});
const textSearchApi = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/place/textsearch/json",
  timeout,
  params,
});
const reverseGeocoderApi = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/geocode/json",
  timeout,
  params,
});
const nearbySearchApi = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
  timeout,
  params,
});
const placeDetailsApi = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/place/details/json",
  timeout,
  params,
});
const photosApi = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/place/photo",
  timeout,
  params,
});

export {
  placesTextSearch,
  directionsSearch,
  distanceMatrixApi,
  textSearchApi,
  reverseGeocoderApi,
  nearbySearchApi,
  placeDetailsApi,
  photosApi,
};
