const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  // get Authorization header including jwt token
  // authorization === 'Bearer dsffjsdj'
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    if (err) {
      return res
        .status(401)
        .send({ error: "You must be logged in", payload: payload });
    }
    const { userId } = payload;

    try {
      const user = await User.findById(userId).exec();
      if (!user.admin) {
        console.log("payload", user);
        throw new Error("Must be an admin");
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).send(error.message);
    }
  });
};
