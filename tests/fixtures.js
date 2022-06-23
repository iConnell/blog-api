const User = require("../models/User");
const { userRegData } = require("./mockData");

const user = await User.create({ userRegData });
const token = await user.createToken();

module.exports = {
  user,
  token,
};
