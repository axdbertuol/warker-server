const _ = require("lodash");

const getReservatorio = function () {
  return Math.floor(Math.random() * Math.floor(100));
};

const getFuelTypes = function () {
  const fuelTypes = ["diesel", "gnv", "etanol"];
  return fuelTypes.map((fuel) => {
    const r = _.random(1);
    console.log("random n", r);
    return r === 0 ? fuel : null;
  });
};

module.exports = { getReservatorio, getFuelTypes };
