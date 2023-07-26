const jwt = require("jsonwebtoken");
const userModel = require("../model/User.model");

module.exports.Auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).send({ msg: "Unauthorized" });
    }
    const token = header.split(" ")[1];

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    
    req.user = decodedToken;

    next();
  } catch (error) {
    console.log({ error });
    return res.status(403).send({ msg: "Forbidden" });
  }
};

module.exports.isAdmin = async (req, res, next) => {
  try {
    const { email } = req.user;

    const isAdmin = await userModel.findOne({ email });
  
    if (isAdmin.roles !== "Admin") {
      return res.status(401).send({ msg: "Unauthorized" });
    }
    req.userEmail = email

    next();
  } catch (error) {
    console.log({ error });
  }
};
