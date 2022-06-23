const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");
const Token = require("../models/Token");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Invalide Token");
  }

  const inputToken = authHeader.split(" ")[1];

  try {
    const dbToken = await Token.findOne({ key: inputToken });

    const user = User.findOne({ _id: dbToken.user });

    req.user = { id: user._id, username: user.username };
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid Token");
  }
};

module.exports = authMiddleware;
