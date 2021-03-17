const getReservatorio = function () {
  return Math.floor(Math.random() * Math.floor(100));
};

const getFuelType = function () {
  const fuelTypes = ["diesel", "gnv", "etanol"];
  return fuelTypes.map((fuel) => {
    const r = Math.floor(Math.random() * Math.floor(2));
    return r === 0 ? fuel : "";
  });
};

module.exports = { getReservatorio, getFuelType };
