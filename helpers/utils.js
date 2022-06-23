const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

const generateToken = async (user) => {
  // generate jwt token
  const jwtToken = jwt.sign(
    { username: user.username, id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_TTL }
  );

  // Check if user has a token
  const oldToken = await Token.findOne({ user: user.id });

  // Delete token if it exists
  if (oldToken) {
    await Token.findOneAndDelete({ user: user.id });
  }

  // save new token to database
  const newToken = await Token.create({ user: user.id, key: jwtToken });

  return newToken.key;
};

module.exports = generateToken;
